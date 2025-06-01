package com.mochamates.web.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.review.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	Page<Review> findByProductId(Long productId, Pageable pageable);

	@Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
	Double findAverageRatingByProductId(@Param("productId") Long productId);

	boolean existsByProductIdAndUserIdAndOrderId(Long productId, Long userId, Long orderId);

	@Query("SELECT r FROM Review r WHERE " + "(:query IS NULL OR r.comment LIKE %:query%) AND "
			+ "(:productId IS NULL OR r.product.id = :productId) AND " + "(:rating IS NULL OR r.rating = :rating) AND "
			+ "(:dateFrom IS NULL OR r.createdAt >= :dateFrom) AND " + "(:dateTo IS NULL OR r.createdAt <= :dateTo)")
	Page<Review> findReviewsWithFilters(@Param("query") String query, @Param("productId") Long productId,
			@Param("rating") Integer rating, @Param("dateFrom") LocalDateTime dateFrom,
			@Param("dateTo") LocalDateTime dateTo, Pageable pageable);

	@Query("SELECT r FROM Review r WHERE r.createdAt BETWEEN :dateFrom AND :dateTo")
	List<Review> findByCreatedAtBetween(@Param("dateFrom") LocalDateTime dateFrom,
			@Param("dateTo") LocalDateTime dateTo);

	boolean existsByOrderItemIdAndOrderIdAndProductIdAndUserId(Long orderItemId, Long orderId, Long productId,
			Long userId);
}