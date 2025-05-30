package com.mochamates.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
			@RequestBody PlaceOrderRequestDTO placeOrderRequestDTO) {
		OrderResponseDTO responseDTO = orderService.createOrder(placeOrderRequestDTO);
		ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1000", "Order created successfully", responseDTO);
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