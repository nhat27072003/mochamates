package com.mochamates.web.dto.statistics;

import java.util.Map;

public class ReviewStatisticsDTO {
	private long totalReviews;
	private double averageRating;
	private Map<Integer, Long> ratingsDistribution;

	// Getters and Setters
	public long getTotalReviews() {
		return totalReviews;
	}

	public void setTotalReviews(long totalReviews) {
		this.totalReviews = totalReviews;
	}

	public double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(double averageRating) {
		this.averageRating = averageRating;
	}

	public Map<Integer, Long> getRatingsDistribution() {
		return ratingsDistribution;
	}

	public void setRatingsDistribution(Map<Integer, Long> ratingsDistribution) {
		this.ratingsDistribution = ratingsDistribution;
	}
}