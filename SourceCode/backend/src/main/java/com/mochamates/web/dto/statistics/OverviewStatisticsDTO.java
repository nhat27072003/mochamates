package com.mochamates.web.dto.statistics;

public class OverviewStatisticsDTO {
	private double totalRevenue;
	private long totalOrders;
	private long totalUsers;
	private long totalProducts;
	private double averageRating;
	private long totalReviews;

	// Getters and Setters
	public double getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

	public long getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(long totalOrders) {
		this.totalOrders = totalOrders;
	}

	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getTotalProducts() {
		return totalProducts;
	}

	public void setTotalProducts(long totalProducts) {
		this.totalProducts = totalProducts;
	}

	public double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(double averageRating) {
		this.averageRating = averageRating;
	}

	public long getTotalReviews() {
		return totalReviews;
	}

	public void setTotalReviews(long totalReviews) {
		this.totalReviews = totalReviews;
	}
}