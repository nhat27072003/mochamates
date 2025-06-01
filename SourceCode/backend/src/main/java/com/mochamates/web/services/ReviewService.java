package com.mochamates.web.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mochamates.web.dto.review.CreateReviewReplyRequestDTO;
import com.mochamates.web.dto.review.CreateReviewRequestDTO;
import com.mochamates.web.dto.review.ProductReviewResponseDTO;
import com.mochamates.web.dto.review.ReviewReplyDTO;
import com.mochamates.web.dto.review.ReviewResponseDTO;
import com.mochamates.web.dto.statistics.ReviewStatisticsDTO;
import com.mochamates.web.entities.User;
import com.mochamates.web.entities.order.Order;
import com.mochamates.web.entities.order.OrderStatus;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.review.Review;
import com.mochamates.web.entities.review.ReviewReply;
import com.mochamates.web.exception.ReviewException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.OrderRepository;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.repository.ReviewReplyRepository;
import com.mochamates.web.repository.ReviewRepository;
import com.mochamates.web.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {
	private final ReviewRepository reviewRepository;
	private final ReviewReplyRepository reviewReplyRepository;
	private final ProductRepository productRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final ObjectMapper objectMapper;

	public ReviewService(ReviewRepository reviewRepository, ReviewReplyRepository reviewReplyRepository,
			ProductRepository productRepository, OrderRepository orderRepository, UserRepository userRepository) {
		this.reviewRepository = reviewRepository;
		this.reviewReplyRepository = reviewReplyRepository;
		this.productRepository = productRepository;
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * Check if a review exists for a specific order item, order, product, and user.
	 * 
	 * @param orderItemId The ID of the order item
	 * @param orderId     The ID of the order
	 * @param productId   The ID of the product
	 * @param user        The authenticated user
	 * @return true if a review exists, false otherwise
	 */
	public boolean hasReviewed(Long orderItemId, Long orderId, Long productId) {
		try {
			User user = getAuthenticatedUser();

			boolean hasReview = reviewRepository.existsByOrderItemIdAndOrderIdAndProductIdAndUserId(orderItemId,
					orderId, productId, user.getId());
			return hasReview;
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("loi o day nay " + e);
		}
		return true;
	}

	@Transactional
	public ReviewResponseDTO createReview(CreateReviewRequestDTO request) {
		User user = getAuthenticatedUser();

		Order order = orderRepository.findById(request.getOrderId())
				.orElseThrow(() -> new ReviewException("Order not found"));
		if (!order.getUserId().equals(user.getId())) {
			throw new ReviewException("Order does not belong to this user");
		}
		if (order.getStatus() != OrderStatus.DELIVERED) {
			throw new ReviewException("Order must be delivered to submit a review");
		}

		CoffeeProduct product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new ReviewException("Product not found"));

		boolean productInOrder = order.getItems().stream()
				.anyMatch(item -> item.getProductId().equals(product.getId()));
		if (!productInOrder) {
			throw new ReviewException("Product not found in this order");
		}

		if (request.getRating() < 1 || request.getRating() > 5) {
			throw new ReviewException("Rating must be between 1 and 5");
		}

		if (reviewRepository.existsByProductIdAndUserIdAndOrderId(product.getId(), user.getId(), order.getId())) {
			throw new ReviewException("User has already reviewed this product for this order");
		}

		Review review = new Review();
		review.setProduct(product);
		review.setUser(user);
		review.setOrderItemId(request.getOrderItemId());
		review.setOrderId(order.getId());
		review.setRating(request.getRating());
		review.setComment(request.getComment());
		reviewRepository.save(review);

		return toReviewResponseDTO(review);
	}

	public ProductReviewResponseDTO getProductReviews(Long productId, Pageable pageable) {
		Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
		Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
		return toProductReviewResponseDTO(reviews, averageRating != null ? averageRating : 0.0);
	}

	public Page<ReviewResponseDTO> getAllReviews(String query, Long productId, Integer rating, LocalDateTime dateFrom,
			LocalDateTime dateTo, Pageable pageable) {
		Page<Review> reviews = reviewRepository.findReviewsWithFilters(query != null && !query.isBlank() ? query : null,
				productId, rating, dateFrom, dateTo, pageable);
		return reviews.map(this::toReviewResponseDTO);
	}

	public ReviewStatisticsDTO getReviewStatistics(LocalDateTime dateFrom, LocalDateTime dateTo) {
		ReviewStatisticsDTO stats = new ReviewStatisticsDTO();

		List<Review> reviews = reviewRepository.findByCreatedAtBetween(dateFrom, dateTo);
		stats.setTotalReviews(reviews.size());

		double averageRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
		stats.setAverageRating(averageRating);

		Map<Integer, Long> ratingsDistribution = reviews.stream()
				.collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
		stats.setRatingsDistribution(ratingsDistribution);

		return stats;
	}

	@Transactional
	public ReviewResponseDTO updateReview(Long reviewId, CreateReviewRequestDTO request) {
		User user = getAuthenticatedUser();
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new ReviewException("Review not found"));

		if (!review.getUser().getId().equals(user.getId())) {
			throw new ReviewException("Unauthorized to update this review");
		}

		if (request.getRating() < 1 || request.getRating() > 5) {
			throw new ReviewException("Rating must be between 1 and 5");
		}

		if (!review.getOrderId().equals(request.getOrderId())
				|| !review.getProduct().getId().equals(request.getProductId())) {
			throw new ReviewException("Cannot change order or product in review update");
		}

		review.setRating(request.getRating());
		review.setComment(request.getComment());
		reviewRepository.save(review);

		return toReviewResponseDTO(review);
	}

	@Transactional
	public void deleteReview(Long reviewId) {
		User user = getAuthenticatedUser();
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new ReviewException("Review not found"));

		if (!review.getUser().getId().equals(user.getId())) {
			throw new ReviewException("Unauthorized to delete this review");
		}

		reviewRepository.delete(review);
	}

	@Transactional
	public ReviewResponseDTO deleteReviewByAdmin(Long reviewId) {
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new ReviewException("Review not found"));
		reviewRepository.delete(review);
		return toReviewResponseDTO(review);
	}

	@Transactional
	public ReviewReplyDTO createReviewReply(Long reviewId, CreateReviewReplyRequestDTO request) {
		User admin = getAuthenticatedUser();
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new ReviewException("Review not found"));

		ReviewReply reply = new ReviewReply();
		reply.setReview(review);
		reply.setAdmin(admin);
		reply.setReply(request.getReply());
		reviewReplyRepository.save(reply);

		return toReviewReplyDTO(reply);
	}

	private User getAuthenticatedUser() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
	}

	private ReviewResponseDTO toReviewResponseDTO(Review review) {
		ReviewResponseDTO response = new ReviewResponseDTO();

		response.setId(review.getId());
		response.setUsername(review.getUser().getUsername());
		response.setProductId(review.getProduct().getId());
		response.setUserId(review.getUser().getId().toString());
		response.setOrderId(review.getOrderId());
		response.setRating(review.getRating());
		response.setComment(review.getComment());
		response.setCreatedAt(review.getCreatedAt());
		response.setUpdatedAt(review.getUpdatedAt());

		List<ReviewReply> replies = reviewReplyRepository.findByReviewId(review.getId());
		List<ReviewReplyDTO> replyDTOs = replies.stream().map(this::toReviewReplyDTO).collect(Collectors.toList());
		response.setReplies(replyDTOs);

		return response;
	}

	private ReviewReplyDTO toReviewReplyDTO(ReviewReply reply) {
		ReviewReplyDTO dto = new ReviewReplyDTO();
		dto.setId(reply.getId());
		dto.setReviewId(reply.getReview().getId());
		dto.setAdminId(reply.getAdmin().getId().toString());
		dto.setReply(reply.getReply());
		dto.setCreatedAt(reply.getCreatedAt());
		return dto;
	}

	private ProductReviewResponseDTO toProductReviewResponseDTO(Page<Review> reviews, Double averageRating) {
		ProductReviewResponseDTO response = new ProductReviewResponseDTO();
		response.setReviews(reviews.map(this::toReviewResponseDTO).getContent());
		response.setAverageRating(averageRating);
		response.setTotalElements(reviews.getTotalElements());
		response.setTotalPages(reviews.getTotalPages());
		response.setPage(reviews.getNumber());
		response.setSize(reviews.getSize());
		return response;
	}
}