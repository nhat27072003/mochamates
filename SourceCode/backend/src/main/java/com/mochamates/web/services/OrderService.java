package com.mochamates.web.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mochamates.web.dto.cart.CartResponseDTO;
import com.mochamates.web.dto.order.OrderItemDTO;
import com.mochamates.web.dto.order.OrderResponseDTO;
import com.mochamates.web.dto.order.PlaceOrderRequestDTO;
import com.mochamates.web.dto.product.OptionDTO;
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

	public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
			CartService cartService, UserRepository userRepository) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.cartService = cartService;
		this.userRepository = userRepository;
		this.objectMapper = new ObjectMapper();
	}

	@Transactional
	public OrderResponseDTO createOrder(PlaceOrderRequestDTO placeOrderRequestDTO) {
		System.out.println("come here order");
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
//			try {
//				orderItem.setSelectedOptions(objectMapper.writeValueAsString(cartItem.getSelectedAttributes()));
//			} catch (Exception e) {
//				throw new RuntimeException("Error serializing options: " + e.getMessage(), e);
//			}
			return orderItem;
		}).collect(Collectors.toList());

		order.setItems(orderItems);
		System.out.println("check orders" + order.getUserId());
		orderRepository.save(order);

		cartService.clearCart();

		return toOrderResponseDTO(order);
	}

	public OrderResponseDTO getOrder(Long orderId) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		User user = getAuthenticatedUser();
//		if (!order.getUserId().equals(user.getId())) {
//			throw new RuntimeException("Unauthorized access to order");
//		}
		return toOrderResponseDTO(order);
	}

	public List<OrderResponseDTO> getUserOrders() {
		User user = getAuthenticatedUser();
		List<Order> orders = orderRepository.findByUserId(user.getId());
		return orders.stream().map(this::toOrderResponseDTO).collect(Collectors.toList());
	}

	public Page<OrderResponseDTO> getAllOrders(String query, OrderStatus status, LocalDateTime dateFrom,
			LocalDateTime dateTo, Double totalMin, Pageable pageable) {
		Page<Order> orders = orderRepository.findOrdersWithFilters(query != null && !query.isBlank() ? query : null,
				status, dateFrom, dateTo, totalMin, pageable);
		return orders.map(this::toOrderResponseDTO);
	}

	@Transactional
	public OrderResponseDTO updateOrderStatusForUser(Long orderId, OrderStatus newStatus) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		User user = getAuthenticatedUser();
		if (!order.getUserId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized access to order");
		}

		if (order.getStatus() == OrderStatus.PENDING && newStatus == OrderStatus.CANCELLED) {
			order.setStatus(OrderStatus.CANCELLED);
		} else if (order.getStatus() == OrderStatus.SHIPPED && newStatus == OrderStatus.DELIVERED) {
			order.setStatus(OrderStatus.DELIVERED);
		} else {
			throw new OrderStatusException("Invalid status transition for user cannot change order from "
					+ order.getStatus() + " to " + newStatus);
		}

		orderRepository.save(order);
		return toOrderResponseDTO(order);
	}

	@Transactional
	public OrderResponseDTO updateOrderStatusForAdmin(Long orderId, OrderStatus newStatus) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException());
		validateAdminStatusTransition(order.getStatus(), newStatus);

		order.setStatus(newStatus);
		orderRepository.save(order);
		return toOrderResponseDTO(order);

	}

	private void validateAdminStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
		if (currentStatus == OrderStatus.DELIVERED || currentStatus == OrderStatus.CANCELLED
				|| currentStatus == OrderStatus.REFUNDED) {
			throw new OrderStatusException("Cannot change status from terminal state: " + currentStatus);
		}
		if (currentStatus == OrderStatus.PENDING
				&& (newStatus == OrderStatus.SHIPPED || newStatus == OrderStatus.DELIVERED)) {
			throw new OrderStatusException("Cannot transition directly from PENDING to " + newStatus);
		}
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
				List<OptionDTO> options = objectMapper.readValue(item.getSelectedOptions(),
						objectMapper.getTypeFactory().constructCollectionType(List.class, OptionDTO.class));
				dto.setSelectedOptions(options);
			} catch (Exception e) {
				dto.setSelectedOptions(new ArrayList<>());
			}
			return dto;
		}).collect(Collectors.toList());

		response.setItems(itemDTOs);
		return response;
	}

}
