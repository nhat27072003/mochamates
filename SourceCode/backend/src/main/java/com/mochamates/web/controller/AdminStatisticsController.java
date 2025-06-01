package com.mochamates.web.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.statistics.AnalyticsOverviewDTO;
import com.mochamates.web.dto.statistics.RevenueByTimeDTO;
import com.mochamates.web.dto.statistics.TopProductDTO;
import com.mochamates.web.dto.statistics.UserStatsDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.OrderService;
import com.mochamates.web.services.ProductService;
import com.mochamates.web.services.ReviewService;
import com.mochamates.web.services.UserService;

/**
 * REST controller for admin analytics. Provides endpoints for retrieving
 * various statistics and insights.
 * 
 * Base path: /api/v1/admin/analytics
 */
@RestController
@RequestMapping("/api/v1/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatisticsController {
	private final OrderService orderService;
	private final UserService userService;
	private final ProductService productService;
	private final ReviewService reviewService;

	public AdminStatisticsController(OrderService orderService, UserService userService, ProductService productService,
			ReviewService reviewService) {
		this.orderService = orderService;
		this.userService = userService;
		this.productService = productService;
		this.reviewService = reviewService;
	}

	/**
	 * Retrieves an overview of key metrics.
	 * 
	 * @return a ResponseEntity containing an ApiResponse with overview stats
	 */
	@GetMapping("/overview")
	public ResponseEntity<ApiResponse<AnalyticsOverviewDTO>> getAnalyticsOverview() {
		AnalyticsOverviewDTO overview = new AnalyticsOverviewDTO();
		overview.setTotalOrders(orderService.getTotalOrders());
		overview.setTotalRevenue(orderService.getTotalRevenue());
		overview.setTotalUsers(userService.getUserStats(LocalDateTime.now().minusDays(30)).getTotalUsers());
		overview.setTotalProducts(productService.getProductsForAdmin(0, 1).getTotalItems());
		overview.setAverageRating(reviewService.getProductReviews(0L, PageRequest.of(0, 1)).getAverageRating());

		ApiResponse<AnalyticsOverviewDTO> response = new ApiResponse<>("1000", "Ok", overview);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves revenue by time period (day, month, year).
	 * 
	 * @param startDate  the start date for the period
	 * @param endDate    the end date for the period
	 * @param periodType the type of period (DAY, MONTH, YEAR)
	 * @return a ResponseEntity containing an ApiResponse with revenue data
	 */
	@GetMapping("/revenue")
	public ResponseEntity<ApiResponse<List<RevenueByTimeDTO>>> getRevenueByPeriod(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
			@RequestParam(defaultValue = "DAY") String periodType) {
		List<RevenueByTimeDTO> revenue = orderService.getRevenueByPeriod(startDate, endDate, periodType);
		ApiResponse<List<RevenueByTimeDTO>> response = new ApiResponse<>("1000", "Ok", revenue);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves top-selling products.
	 * 
	 * @param startDate the start date for the period
	 * @param endDate   the end date for the period
	 * @param limit     the maximum number of products to return
	 * @return a ResponseEntity containing an ApiResponse with top products
	 */
	@GetMapping("/top-products")
	public ResponseEntity<ApiResponse<List<TopProductDTO>>> getTopSellingProducts(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
			@RequestParam(defaultValue = "10") int limit) {
		List<TopProductDTO> topProducts = productService.getTopSellingProducts(startDate, endDate, limit);
		ApiResponse<List<TopProductDTO>> response = new ApiResponse<>("1000", "Ok", topProducts);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves user statistics.
	 * 
	 * @param startDate the start date for new user count
	 * @return a ResponseEntity containing an ApiResponse with user stats
	 */
	@GetMapping("/users")
	public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
		UserStatsDTO stats = userService.getUserStats(startDate);
		ApiResponse<UserStatsDTO> response = new ApiResponse<>("1000", "Ok", stats);
		return ResponseEntity.ok(response);
	}
}