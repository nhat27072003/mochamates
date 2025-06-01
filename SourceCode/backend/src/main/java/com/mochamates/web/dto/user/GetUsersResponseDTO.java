package com.mochamates.web.dto.user;

import java.util.List;

public class GetUsersResponseDTO {
	private List<UserDetailResponse> users;
	private int currentPage;
	private long totalItems;
	private int totalPages;

	// Getters and Setters
	public List<UserDetailResponse> getUsers() {
		return users;
	}

	public void setUsers(List<UserDetailResponse> users) {
		this.users = users;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public long getTotalItems() {
		return totalItems;
	}

	public void setTotalItems(long totalItems) {
		this.totalItems = totalItems;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}
}