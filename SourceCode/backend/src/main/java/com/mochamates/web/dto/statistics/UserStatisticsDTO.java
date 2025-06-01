package com.mochamates.web.dto.statistics;

import java.util.Map;

public class UserStatisticsDTO {
	private long totalUsers;
	private long newUsers;
	private Map<String, Long> usersByRegistrationDate;

	// Getters and Setters
	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getNewUsers() {
		return newUsers;
	}

	public void setNewUsers(long newUsers) {
		this.newUsers = newUsers;
	}

	public Map<String, Long> getUsersByRegistrationDate() {
		return usersByRegistrationDate;
	}

	public void setUsersByRegistrationDate(Map<String, Long> usersByRegistrationDate) {
		this.usersByRegistrationDate = usersByRegistrationDate;
	}
}