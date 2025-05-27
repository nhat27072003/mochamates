package com.mochamates.web.dto.review;

import java.util.List;

public class ProductReviewResponseDTO {
	private List<ReviewResponseDTO> reviews;
	private Double averageRating;
	private long totalElements;
	private int totalPages;
	private int page;
	private int size;

	public List<ReviewResponseDTO> getReviews() {
		return reviews;
	}

	public void setReviews(List<ReviewResponseDTO> reviews) {
		this.reviews = reviews;
	}

	public Double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(Double averageRating) {
		this.averageRating = averageRating;
	}

	public long getTotalElements() {
		return totalElements;
	}

	public void setTotalElements(long totalElements) {
		this.totalElements = totalElements;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

}
