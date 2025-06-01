package com.mochamates.web.dto.statistics;

import java.util.Map;

import com.mochamates.web.entities.order.OrderStatus;

public class OrderStatisticsDTO {
	private long totalOrders;
	private double totalRevenue;
	private Map<OrderStatus, Long> ordersByStatus;
	private Map<String, Long> ordersByDate;

	// Getters and Setters
	public long getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(long totalOrders) {
		this.totalOrders = totalOrders;
	}

	public double getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

	public Map<OrderStatus, Long> getOrdersByStatus() {
		return ordersByStatus;
	}

	public void setOrdersByStatus(Map<OrderStatus, Long> ordersByStatus) {
		this.ordersByStatus = ordersByStatus;
	}

	public Map<String, Long> getOrdersByDate() {
		return ordersByDate;
	}

	public void setOrdersByDate(Map<String, Long> ordersByDate) {
		this.ordersByDate = ordersByDate;
	}
}