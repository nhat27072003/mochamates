package com.mochamates.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.order.OrderResponseDTO;
import com.mochamates.web.dto.order.PlaceOrderRequestDTO;
import com.mochamates.web.dto.order.UpdateOrderStatusRequestDTO;
import com.mochamates.web.entities.order.OrderStatus;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.OrderService;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	/**
	 * Creates an order from the user's cart.
	 *
	 * @return ResponseEntity with order details
	 */
	@PostMapping
	public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
			@RequestBody PlaceOrderRequestDTO placeOrderRequestDTO) {
		Map<String, Object> responseDTO = orderService.createOrder(placeOrderRequestDTO);
		ApiResponse<Map<String, Object>> response = new ApiResponse<>("1000", "Order created successfully",
				responseDTO);
		return ResponseEntity.ok(response);

	}

	/**
	 * Retrieves a paginated list of orders filtered by status.
	 *
	 * @param status the status to filter orders by (e.g., PENDING, PROCESSING,
	 *               SHIPPED, DELIVERED, CANCELLED)
	 * @param page   the page number (default is 0)
	 * @param size   the number of items per page (default is 10)
	 * @param sort   the sort field and direction (default is id,desc)
	 * @return ResponseEntity containing a paginated list of orders
	 */
	@GetMapping("/by-status")
	public ResponseEntity<ApiResponse<Map<String, Object>>> getOrdersByStatus(@RequestParam String status,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id,desc") String sort) {
		// Parse sort parameter
		String[] sortParams = sort.split(",");
		Sort.Direction direction = Sort.Direction.fromString(sortParams[1]);
		Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

		// Fetch orders by status (status can be "all")
		Page<OrderResponseDTO> ordersPage = orderService.getAllOrders(null, status, null, null, null, pageable);

		// Prepare response
		Map<String, Object> responseData = Map.of("orders", ordersPage.getContent(), "currentPage",
				ordersPage.getNumber(), "totalItems", ordersPage.getTotalElements(), "totalPages",
				ordersPage.getTotalPages());

		ApiResponse<Map<String, Object>> response = new ApiResponse<>("1000", "Orders retrieved successfully",
				responseData);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves the most recent orders.
	 *
	 * @param limit the maximum number of orders to return (default is 5)
	 * @return ResponseEntity with a list of recent orders
	 */
	@GetMapping("/recent")
	public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getRecentOrders(
			@RequestParam(defaultValue = "5") int limit) {
		if (limit <= 0) {
			return ResponseEntity.badRequest().body(new ApiResponse<>("2003", "Limit must be greater than 0", null));
		}

		List<OrderResponseDTO> recentOrders = orderService.getRecentOrders(limit);
		ApiResponse<List<OrderResponseDTO>> response = new ApiResponse<>("1000", "Recent orders retrieved successfully",
				recentOrders);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves a specific order by ID.
	 *
	 * @param orderId ID of the order
	 * @return ResponseEntity with order details
	 */
	@GetMapping("/{orderId}")
	public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrder(@PathVariable Long orderId) {

		OrderResponseDTO responseDTO = orderService.getOrder(orderId);
		ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1000", "Order retrieved successfully", responseDTO);
		return ResponseEntity.ok(response);

	}

	/**
	 * Retrieves all orders for the authenticated user.
	 *
	 * @return ResponseEntity with list of orders
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders() {

		List<OrderResponseDTO> responseDTO = orderService.getUserOrders();
		ApiResponse<List<OrderResponseDTO>> response = new ApiResponse<>("1000", "Orders retrieved successfully",
				responseDTO);
		return ResponseEntity.ok(response);

	}

	@PutMapping("/{orderId}/status")
	public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(@PathVariable Long orderId,
			@RequestBody UpdateOrderStatusRequestDTO request) {

		OrderResponseDTO responseDTO = orderService.updateOrderStatusForUser(orderId,
				OrderStatus.valueOf(request.getStatus()));
		ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1000", "Order status updated successfully",
				responseDTO);
		return ResponseEntity.ok(response);

	}
}