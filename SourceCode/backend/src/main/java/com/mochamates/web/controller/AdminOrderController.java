package com.mochamates.web.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.order.OrderResponseDTO;
import com.mochamates.web.dto.order.PaginatedResponseDTO;
import com.mochamates.web.dto.order.UpdateOrderStatusRequestDTO;
import com.mochamates.web.entities.order.OrderStatus;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.OrderService;

@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {
	private final OrderService orderService;

	public AdminOrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	/**
	 * Retrieves all orders in the system.
	 *
	 * @return ResponseEntity with list of all orders
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<PaginatedResponseDTO<OrderResponseDTO>>> getAllOrders(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "id,desc") String sort, @RequestParam(required = false) String q,
			@RequestParam(required = false) String status,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
			@RequestParam(required = false) Double totalMin) {

		String[] sortParams = sort.split(",");
		String sortField = sortParams[0];
		Sort.Direction sortDirection = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
				? Sort.Direction.ASC
				: Sort.Direction.DESC;
		Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

		Page<OrderResponseDTO> ordersPage = orderService.getAllOrders(q, status, dateFrom, dateTo, totalMin, pageable);
		PaginatedResponseDTO<OrderResponseDTO> paginatedResponse = new PaginatedResponseDTO<>(ordersPage.getContent(),
				ordersPage.getNumber(), ordersPage.getSize(), ordersPage.getTotalElements(),
				ordersPage.getTotalPages());

		ApiResponse<PaginatedResponseDTO<OrderResponseDTO>> response = new ApiResponse<>("1000",
				"Orders retrieved successfully", paginatedResponse);
		return ResponseEntity.ok(response);
	}

	/**
	 *
	 * 
	 * Retrieves a specific order by ID.**
	 * 
	 * @param orderId ID of the order*@return ResponseEntity with order details
	 */

	@GetMapping("/{orderId}")
	public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrder(@PathVariable Long orderId) {
		try {
			OrderResponseDTO responseDTO = orderService.getOrderForAdmin(orderId);
			ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1000", "Order retrieved successfully",
					responseDTO);
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1006", "Order not found: " + e.getMessage(),
					null);
			return ResponseEntity.status(404).body(response);
		}
	}

	/**
	 * Updates the status of an order (admin only).
	 *
	 * @param orderId ID of the order
	 * @param request DTO containing the new status
	 * @return ResponseEntity with updated order details
	 */
	@PutMapping("/{orderId}/status")
	public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(@PathVariable Long orderId,
			@RequestBody UpdateOrderStatusRequestDTO request) {

		OrderResponseDTO responseDTO = orderService.updateOrderStatusForAdmin(orderId,
				OrderStatus.valueOf(request.getStatus()));
		ApiResponse<OrderResponseDTO> response = new ApiResponse<>("1000", "Order status updated successfully",
				responseDTO);
		return ResponseEntity.ok(response);

	}
}
