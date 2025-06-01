package com.mochamates.web.dto.statistics;

public class ProductSalesDTO {
	private Long productId;
	private String name;
	private long totalSold;
	private double totalRevenue;

	// Getters and Setters
	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getTotalSold() {
		return totalSold;
	}

	public void setTotalSold(long totalSold) {
		this.totalSold = totalSold;
	}

	public double getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}
}