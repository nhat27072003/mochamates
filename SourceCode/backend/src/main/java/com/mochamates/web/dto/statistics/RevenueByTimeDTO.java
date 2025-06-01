package com.mochamates.web.dto.statistics;

import java.time.LocalDateTime;

public class RevenueByTimeDTO {
	private LocalDateTime periodStart;
	private double revenue;
	private long orderCount;

	// Getters and Setters
	public LocalDateTime getPeriodStart() {
		return periodStart;
	}

	public void setPeriodStart(LocalDateTime periodStart) {
		this.periodStart = periodStart;
	}

	public double getRevenue() {
		return revenue;
	}

	public void setRevenue(double revenue) {
		this.revenue = revenue;
	}

	public long getOrderCount() {
		return orderCount;
	}

	public void setOrderCount(long orderCount) {
		this.orderCount = orderCount;
	}
}