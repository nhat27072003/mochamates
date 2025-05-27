package com.mochamates.web.dto.review;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewResponseDTO {
	private Long id;
	private Long productId;
	private String userId;
	private Long orderId;
	private Integer rating;
	private String comment;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<ReviewReplyDTO> replies;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public List<ReviewReplyDTO> getReplies() {
		return replies;
	}

	public void setReplies(List<ReviewReplyDTO> replies) {
		this.replies = replies;
	}

}
