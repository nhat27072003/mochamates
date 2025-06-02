package com.mochamates.web.services;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mochamates.web.dto.cart.CartResponseDTO;
import com.mochamates.web.dto.order.OrderItemDTO;
import com.mochamates.web.dto.order.OrderResponseDTO;
import com.mochamates.web.dto.order.PlaceOrderRequestDTO;
import com.mochamates.web.dto.statistics.RevenueByTimeDTO;
import com.mochamates.web.entities.User;
import com.mochamates.web.entities.order.Order;
import com.mochamates.web.entities.order.OrderItem;
import com.mochamates.web.entities.order.OrderStatus;
import com.mochamates.web.exception.OrderCreateException;
import com.mochamates.web.exception.OrderNotFoundException;
import com.mochamates.web.exception.OrderStatusException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.OrderItemRepository;
import com.mochamates.web.repository.OrderRepository;
import com.mochamates.web.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final CartService cartService;
	private final UserRepository userRepository;
	private final ObjectMapper objectMapper;

	@Value("${vnpay.tmnCode}")
	private String vnp_TmnCode;

	@Value("${vnpay.hashSecret}")
	private String vnp_HashSecret;

	@Value("${vnpay.paymentUrl}")
	private String vnp_PayUrl;

	@Value("${vnpay.returnUrl}")
	private String vnp_ReturnUrl;

	public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
			CartService cartService, UserRepository userRepository) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.cartService = cartService;
		this.userRepository = userRepository;
		this.objectMapper = new ObjectMapper();
	}

	// Các phương thức khác giữ nguyên, chỉ cập nhật các phương thức liên quan

	@Transactional
	public OrderResponseDTO updateOrderStatusForAdmin(Long orderId, OrderStatus newStatus) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());

		validateAdminStatusTransition(order.getStatus(), newStatus);

		order.setStatus(newStatus);
		order.setUpdatedAt(LocalDateTime.now()); // Cập nhật thời gian
		orderRepository.save(order);

		return toOrderResponseDTO(order);
	}

	private void validateAdminStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
		// Ngăn chặn thay đổi từ trạng thái kết thúc
		if (List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.FAILED)
				.contains(currentStatus)) {
			throw new OrderStatusException("Cannot change status from terminal state: " + currentStatus);
		}

		// Kiểm tra các chuyển đổi hợp lệ
		switch (currentStatus) {
		case PENDING:
			if (!List.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED).contains(newStatus)) {
				throw new OrderStatusException(
						"Invalid transition from PENDING to " + newStatus + ". Allowed: CONFIRMED, CANCELLED");
			}
			break;
		case CONFIRMED:
			if (!List.of(OrderStatus.PAID, OrderStatus.CANCELLED).contains(newStatus)) {
				throw new OrderStatusException(
						"Invalid transition from CONFIRMED to " + newStatus + ". Allowed: PAID, CANCELLED");
			}
			break;
		case PAID:
			if (!List.of(OrderStatus.SHIPPED, OrderStatus.REFUNDED).contains(newStatus)) {
				throw new OrderStatusException(
						"Invalid transition from PAID to " + newStatus + ". Allowed: SHIPPED, REFUNDED");
			}
			break;
		case SHIPPED:
			if (!List.of(OrderStatus.DELIVERED, OrderStatus.FAILED).contains(newStatus)) {
				throw new OrderStatusException(
						"Invalid transition from SHIPPED to " + newStatus + ". Allowed: DELIVERED, FAILED");
			}
			break;
		default:
			throw new OrderStatusException("Invalid current status: " + currentStatus);
		}
	}

	// Các phương thức khác giữ nguyên
	public List<OrderResponseDTO> getRecentOrders(int limit) {
		Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createAt"));
		Page<Order> recentOrders = orderRepository.findAll(pageable);
		return recentOrders.getContent().stream().map(this::toOrderResponseDTO).collect(Collectors.toList());
	}

	@Transactional
	public Map<String, Object> createOrder(PlaceOrderRequestDTO placeOrderRequestDTO) {
		User user = getAuthenticatedUser();
		CartResponseDTO cart = cartService.getCart();

		if (cart.getItems().isEmpty()) {
			throw new OrderCreateException("Cannot create order: Cart is empty");
		}

		Order order = new Order();
		order.setUserId(user.getId());
		order.setSubtotal(cart.getSubtotal());
		order.setShipping(cart.getShipping());
		order.setTotal(cart.getTotal());
		order.setStatus(OrderStatus.PENDING);
		order.setCreateAt(LocalDateTime.now());
		order.setUpdatedAt(LocalDateTime.now());

		order.setFullName(placeOrderRequestDTO.getFullName());
		order.setPhoneNumber(placeOrderRequestDTO.getPhoneNumber());
		order.setStreetAddress(placeOrderRequestDTO.getStreetAddress());
		order.setCity(placeOrderRequestDTO.getCity());
		order.setDistrict(placeOrderRequestDTO.getDistrict());
		order.setWard(placeOrderRequestDTO.getWard());
		order.setPostalCode(placeOrderRequestDTO.getPostalCode());
		order.setPaymentMethod(placeOrderRequestDTO.getPaymentMethod());

		List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
			OrderItem orderItem = new OrderItem();
			orderItem.setOrder(order);
			orderItem.setProductId(cartItem.getProductId());
			orderItem.setName(cartItem.getName());
			orderItem.setPrice(cartItem.getPrice());
			orderItem.setTotalPrice(cartItem.getTotalPrice());
			orderItem.setImageUrl(cartItem.getImageUrl());
			orderItem.setQuantity(cartItem.getQuantity());
			try {
				orderItem.setSelectedOptions(objectMapper.writeValueAsString(cartItem.getSelectedOptions()));
			} catch (Exception e) {
				throw new RuntimeException("Error serializing options: " + e.getMessage(), e);
			}
			return orderItem;
		}).collect(Collectors.toList());

		order.setItems(orderItems);
		orderRepository.save(order);
		cartService.clearCart();
		Map<String, Object> response = new HashMap<>();
		response.put("order", toOrderResponseDTO(order));

		if ("VNPAY".equalsIgnoreCase(placeOrderRequestDTO.getPaymentMethod())) {
			try {
				String paymentUrl = createVNPayPaymentUrl(order, placeOrderRequestDTO.getIpAddress());
				response.put("paymentUrl", paymentUrl);
			} catch (Exception e) {
				throw new OrderCreateException("Error creating VNPay payment URL: " + e.getMessage());
			}
		}

		return response;
	}

	public String createVNPayPaymentUrl(Order order, String ipAddress) throws UnsupportedEncodingException {
		String vnp_Version = "2.1.0";
		String vnp_Command = "pay";
		String vnp_OrderInfo = "Thanh toan don hang #" + order.getId();
		String vnp_OrderType = "billpayment";
		String vnp_TxnRef = String.valueOf(order.getId());
		String vnp_IpAddr = ipAddress;
		String vnp_CreateDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
		String vnp_ExpireDate = LocalDateTime.now().plusMinutes(15)
				.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

		long amount = (long) (order.getTotal() * 100); // VNPay requires amount in VND * 100

		Map<String, String> vnp_Params = new HashMap<>();
		vnp_Params.put("vnp_Version", vnp_Version);
		vnp_Params.put("vnp_Command", vnp_Command);
		vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(amount));
		vnp_Params.put("vnp_CurrCode", "VND");
		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
		vnp_Params.put("vnp_OrderType", vnp_OrderType);
		vnp_Params.put("vnp_Locale", "vn");
		vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
		vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
		vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
		vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

		StringBuilder query = new StringBuilder();
		vnp_Params.entrySet().stream().sorted(Map.Entry.comparingByKey()).forEach(entry -> {
			try {
				query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII.toString())).append("=")
						.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString())).append("&");
			} catch (UnsupportedEncodingException e) {
				throw new RuntimeException("Error encoding URL parameters", e);
			}
		});

		String queryUrl = query.toString();
		String vnp_SecureHash = hmacSHA512(vnp_HashSecret, queryUrl.substring(0, queryUrl.length() - 1));
		queryUrl += "vnp_SecureHash=" + vnp_SecureHash;

		return vnp_PayUrl + "?" + queryUrl;
	}

	@Transactional
	public OrderResponseDTO processVNPayCallback(Map<String, String> params) {
		String vnp_SecureHash = params.get("vnp_SecureHash");
		params.remove("vnp_SecureHash");

		Long orderId = Long.parseLong(params.get("vnp_TxnRef"));
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());

		if ("00".equals(params.get("vnp_ResponseCode"))) {
			order.setStatus(OrderStatus.PAID);
		} else {
			order.setStatus(OrderStatus.FAILED);
		}

		order.setUpdatedAt(LocalDateTime.now());
		orderRepository.save(order);
		return toOrderResponseDTO(order);
	}

	private String hmacSHA512(String key, String data) {
		try {
			Mac mac = Mac.getInstance("HmacSHA512");
			SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
			mac.init(secretKey);
			byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
			StringBuilder result = new StringBuilder();
			for (byte b : hmacData) {
				result.append(String.format("%02x", b));
			}
			return result.toString();
		} catch (Exception e) {
			throw new RuntimeException("Error computing HMAC SHA512", e);
		}
	}

	public OrderResponseDTO getOrder(Long orderId) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());
		User user = getAuthenticatedUser();
		if (!order.getUserId().equals(user.getId())) {
			throw new OrderStatusException("Unauthorized access to order");
		}
		return toOrderResponseDTO(order);
	}

	public OrderResponseDTO getOrderForAdmin(Long orderId) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());
		return toOrderResponseDTO(order);
	}

	public List<OrderResponseDTO> getUserOrders() {
		User user = getAuthenticatedUser();
		List<Order> orders = orderRepository.findByUserId(user.getId());
		return orders.stream().map(this::toOrderResponseDTO).collect(Collectors.toList());
	}

	public Page<OrderResponseDTO> getAllOrders(String query, String status, LocalDateTime dateFrom,
			LocalDateTime dateTo, Double totalMin, Pageable pageable) {
		OrderStatus orderStatus = null;
		if (status != null && !"all".equalsIgnoreCase(status)) {
			try {
				orderStatus = OrderStatus.valueOf(status.toUpperCase());
			} catch (IllegalArgumentException e) {
				throw new OrderStatusException("Invalid order status: " + status);
			}
		}

		Page<Order> orders = orderRepository.findOrdersWithFilters(query != null && !query.isBlank() ? query : null,
				orderStatus, dateFrom, dateTo, totalMin, pageable);
		return orders.map(this::toOrderResponseDTO);
	}

	@Transactional
	public OrderResponseDTO updateOrderStatusForUser(Long orderId, OrderStatus newStatus) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());
		User user = getAuthenticatedUser();
		if (!order.getUserId().equals(user.getId())) {
			throw new OrderStatusException("Unauthorized access to order");
		}

		if (order.getStatus() == OrderStatus.PENDING && newStatus == OrderStatus.CANCELLED) {
			order.setStatus(OrderStatus.CANCELLED);
		} else if (order.getStatus() == OrderStatus.SHIPPED && newStatus == OrderStatus.DELIVERED) {
			order.setStatus(OrderStatus.DELIVERED);
		} else {
			throw new OrderStatusException("Invalid status transition for user: cannot change order from "
					+ order.getStatus() + " to " + newStatus);
		}

		order.setUpdatedAt(LocalDateTime.now());
		orderRepository.save(order);
		return toOrderResponseDTO(order);
	}

	public long getTotalOrders() {
		return orderRepository.count();
	}

	public double getTotalRevenue() {
		return orderRepository.findAll().stream()
				.filter(order -> order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.DELIVERED)
				.mapToDouble(Order::getTotal).sum();
	}

	public List<RevenueByTimeDTO> getRevenueByPeriod(LocalDateTime startDate, LocalDateTime endDate,
			String periodType) {
		List<Object[]> results;
		if ("DAY".equalsIgnoreCase(periodType)) {
			results = orderRepository.findRevenueByDay(startDate, endDate);
		} else if ("MONTH".equalsIgnoreCase(periodType)) {
			results = orderRepository.findRevenueByMonth(startDate, endDate);
		} else if ("YEAR".equalsIgnoreCase(periodType)) {
			results = orderRepository.findRevenueByYear(startDate, endDate);
		} else {
			throw new OrderStatusException("Invalid period type: " + periodType);
		}

		return results.stream().map(row -> {
			RevenueByTimeDTO dto = new RevenueByTimeDTO();
			dto.setPeriodStart((LocalDateTime) row[0]);
			dto.setRevenue((Double) row[1]);
			dto.setOrderCount((Long) row[2]);
			return dto;
		}).collect(Collectors.toList());
	}

	private User getAuthenticatedUser() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
	}

	private OrderResponseDTO toOrderResponseDTO(Order order) {
		OrderResponseDTO response = new OrderResponseDTO();
		response.setId(order.getId());
		response.setUserId(order.getUserId().toString());
		response.setSubtotal(order.getSubtotal());
		response.setShipping(order.getShipping());
		response.setTotal(order.getTotal());
		response.setStatus(order.getStatus().name());
		response.setCreateAt(order.getCreateAt());
		response.setUpdatedAt(order.getUpdatedAt());
		response.setFullName(order.getFullName());
		response.setPhoneNumber(order.getPhoneNumber());
		response.setStreetAddress(order.getStreetAddress());
		response.setCity(order.getCity());
		response.setDistrict(order.getDistrict());
		response.setWard(order.getWard());
		response.setPostalCode(order.getPostalCode());
		response.setPaymentMethod(order.getPaymentMethod());

		List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
		List<OrderItemDTO> itemDTOs = items.stream().map(item -> {
			OrderItemDTO dto = new OrderItemDTO();
			dto.setId(item.getId());
			dto.setProductId(item.getProductId());
			dto.setName(item.getName());
			dto.setPrice(item.getPrice());
			dto.setTotalPrice(item.getTotalPrice());
			dto.setImageUrl(item.getImageUrl());
			dto.setQuantity(item.getQuantity());
			try {
				@SuppressWarnings("unchecked")
				Map<String, List<String>> options = item.getSelectedOptions() != null
						? objectMapper.readValue(item.getSelectedOptions(), Map.class)
						: null;
				dto.setSelectedOptions(options);
			} catch (Exception e) {
				dto.setSelectedOptions(null);
			}
			return dto;
		}).collect(Collectors.toList());

		response.setItems(itemDTOs);
		return response;
	}
}