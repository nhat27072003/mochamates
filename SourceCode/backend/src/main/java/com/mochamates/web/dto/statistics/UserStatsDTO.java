package com.mochamates.web.dto.statistics;

public class UserStatsDTO {
	private long totalUsers;
	private long adminUsers;
	private long customerUsers;
	private long newUsers;

	// Getters and Setters
	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getAdminUsers() {
		return adminUsers;
	}

	public void setAdminUsers(long adminUsers) {
		this.adminUsers = adminUsers;
	}

	public long getCustomerUsers() {
		return customerUsers;
	}

	public void setCustomerUsers(long customerUsers) {
		this.customerUsers = customerUsers;
	}

	public long getNewUsers() {
		return newUsers;
	}

	public void setNewUsers(long newUsers) {
		this.newUsers = newUsers;
	}
}