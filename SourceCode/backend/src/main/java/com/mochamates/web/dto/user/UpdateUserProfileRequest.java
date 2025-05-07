package com.mochamates.web.dto.user;

public class UpdateUserProfileRequest {
	private String fullName;

	private String address;

	private String phone;

	public UpdateUserProfileRequest(String fullName, String address, String phone) {
		this.fullName = fullName;
		this.address = address;
		this.phone = phone;
	}
}
