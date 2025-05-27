package com.mochamates.web.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.order.PaginatedResponseDTO;
import com.mochamates.web.dto.review.CreateReviewReplyRequestDTO;
import com.mochamates.web.dto.review.ReviewReplyDTO;
import com.mochamates.web.dto.review.ReviewResponseDTO;
import com.mochamates.web.exception.ReviewException;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.ReviewService;

@RestController
@RequestMapping("/api/v1/admin/reviews")
public class AdminReviewController {
	private final ReviewService reviewService;

	public AdminReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<PaginatedResponseDTO<ReviewResponseDTO>>> getAllReviews(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "createdAt,desc") String sort, @RequestParam(required = false) String q,
			@RequestParam(required = false) Long productId, @RequestParam(required = false) Integer rating,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo) {
		try {
			String[] sortParams = sort.split(",");
			String sortField = sortParams[0];
			Sort.Direction sortDirection = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc")
					? Sort.Direction.ASC
					: Sort.Direction.DESC;
			Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

			Page<ReviewResponseDTO> reviewsPage = reviewService.getAllReviews(q, productId, rating, dateFrom, dateTo,
					pageable);
			PaginatedResponseDTO<ReviewResponseDTO> paginatedResponse = new PaginatedResponseDTO<>(
					reviewsPage.getContent(), reviewsPage.getNumber(), reviewsPage.getSize(),
					reviewsPage.getTotalElements(), reviewsPage.getTotalPages());

			ApiResponse<PaginatedResponseDTO<ReviewResponseDTO>> response = new ApiResponse<>("1000",
					"Reviews retrieved successfully", paginatedResponse);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			ApiResponse<PaginatedResponseDTO<ReviewResponseDTO>> response = new ApiResponse<>("1007",
					"Invalid parameters: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}

	@PostMapping("/{reviewId}/reply")
	public ResponseEntity<ApiResponse<ReviewReplyDTO>> createReviewReply(@PathVariable Long reviewId,
			@RequestBody CreateReviewReplyRequestDTO request) {
		try {
			ReviewReplyDTO responseDTO = reviewService.createReviewReply(reviewId, request);
			ApiResponse<ReviewReplyDTO> response = new ApiResponse<>("1000", "Reply created successfully", responseDTO);
			return ResponseEntity.ok(response);
		} catch (ReviewException e) {
			ApiResponse<ReviewReplyDTO> response = new ApiResponse<>("3004",
					"Failed to create reply: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}

	@DeleteMapping("/{reviewId}")
	public ResponseEntity<ApiResponse<ReviewResponseDTO>> deleteReview(@PathVariable Long reviewId) {
		try {
			ReviewResponseDTO responseDTO = reviewService.deleteReviewByAdmin(reviewId);
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("1000", "Review deleted successfully",
					responseDTO);
			return ResponseEntity.ok(response);
		} catch (ReviewException e) {
			ApiResponse<ReviewResponseDTO> response = new ApiResponse<>("3003",
					"Failed to delete review: " + e.getMessage(), null);
			return ResponseEntity.status(400).body(response);
		}
	}
}
