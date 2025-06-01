package com.mochamates.web.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.review.CreateReviewRequestDTO;
import com.mochamates.web.dto.review.ProductReviewResponseDTO;
import com.mochamates.web.dto.review.ReviewResponseDTO;
import com.mochamates.web.exception.ReviewException;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.ReviewService;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
	private final ReviewService reviewService;

	public ReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}

	@PostMapping
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<ApiResponse<ReviewResponseDTO>> createReview(@RequestBody CreateReviewRequestDTO request) {
		try {
			ReviewResponseDTO responseDTO = reviewService.createReview(request);
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("1000", "Review created successfully",
					responseDTO);
			return ResponseEntity.ok(response);
		} catch (ReviewException e) {
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("3001",
					"Failed to create review: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}

	@GetMapping("/product/{productId}")
	public ResponseEntity<ApiResponse<ProductReviewResponseDTO>> getProductReviews(@PathVariable Long productId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "createdAt,desc") String sort) {
		String[] sortParams = sort.split(",");
		String sortField = sortParams[0];
		Sort.Direction sortDirection = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
				? Sort.Direction.ASC
				: Sort.Direction.DESC;
		Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

		ProductReviewResponseDTO reviews = reviewService.getProductReviews(productId, pageable);
		ApiResponse<ProductReviewResponseDTO> response = new ApiResponse<>("1000", "Reviews retrieved successfully",
				reviews);
		return ResponseEntity.ok(response);

	}

	@PutMapping("/{reviewId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ApiResponse<ReviewResponseDTO>> updateReview(@PathVariable Long reviewId,
			@RequestBody CreateReviewRequestDTO request) {
		try {
			ReviewResponseDTO responseDTO = reviewService.updateReview(reviewId, request);
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("1000", "Review updated successfully",
					responseDTO);
			return ResponseEntity.ok(response);
		} catch (ReviewException e) {
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("3002",
					"Failed to update review: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}

	@GetMapping("/has-reviewed")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ApiResponse<Boolean>> hasReviewed(@RequestParam Long orderItemId, @RequestParam Long orderId,
			@RequestParam Long productId) {
		boolean hasReviewed = reviewService.hasReviewed(orderItemId, orderId, productId);
		ApiResponse<Boolean> response = new ApiResponse<Boolean>("1000", "Ok", hasReviewed);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{reviewId}")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
		try {
			reviewService.deleteReview(reviewId);
			ApiResponse<Void> response = new ApiResponse<>("1000", "Review deleted successfully", null);
			return ResponseEntity.ok(response);
		} catch (ReviewException e) {
			ApiResponse<Void> response = new ApiResponse<>("3003", "Failed to delete review: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}
}
