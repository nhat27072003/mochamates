package com.mochamates.web.dto.user;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDetailResponse {
	private Long id;
	private String username;
	private String email;
	private String phone;
	private String fullName;
	private LocalDate dateOfBirth;
	private String gender;
	private String address;
	private String role;
	private LocalDateTime createAt;
	private LocalDateTime updateAt;
	private boolean isVerify;

	public UserDetailResponse(Long id, String username, String email, String phone, String fullName,
			LocalDate dateOfBirth, String gender, String address, String role, LocalDateTime createAt,
			LocalDateTime updateAt, boolean isVerify) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.phone = phone;
		this.fullName = fullName;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.address = address;
		this.role = role;
		this.createAt = createAt;
		this.updateAt = updateAt;
		this.isVerify = isVerify;
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

	public String getPhone() {
		return phone;
	}

	public String getFullName() {
		return fullName;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public String getGender() {
		return gender;
	}

	public String getAddress() {
		return address;
	}

	public String getRole() {
		return role;
	}

	public LocalDateTime getCreateAt() {
		return createAt;
	}

	public LocalDateTime getUpdateAt() {
		return updateAt;
	}

	public boolean isVerify() {
		return isVerify;
	}
}