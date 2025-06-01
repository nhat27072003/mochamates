package com.mochamates.web.entities.review;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.mochamates.web.entities.User;
import com.mochamates.web.entities.products.CoffeeProduct;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "reviews", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "order_item_id", "order_id", "product_id", "user_id" }) }, indexes = {
				@Index(columnList = "order_item_id, order_id, product_id, user_id") })
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private CoffeeProduct product;
	@Column(name = "order_item_id", nullable = false)
	private Long orderItemId;
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	@Column(name = "order_id", nullable = false)

	private Long orderId;

	@OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ReviewReply> replies = new ArrayList();

	@Column(nullable = false)
	private Integer rating; // 1 to 5

	@Column(columnDefinition = "TEXT")
	private String comment;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CoffeeProduct getProduct() {
		return product;
	}

	public void setProduct(CoffeeProduct product) {
		this.product = product;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
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

	public List<ReviewReply> getReplies() {
		return replies;
	}

	public void setReplies(List<ReviewReply> replies) {
		this.replies = replies;
	}

	public Long getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(Long orderItemId) {
		this.orderItemId = orderItemId;
	}

}
