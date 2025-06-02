package com.mochamates.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.user.ChangePasswordRequestDTO;
import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.dto.user.UserProfileUpdateRequestDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.UserService;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<ApiResponse<UserDetailResponse>> getCurrentUser() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		UserDetailResponse user = userService.getUserProfile(username);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "User profile retrieved successfully",
				user);
		return ResponseEntity.status(200).body(response);
	}

	@PutMapping("/profile")
	public ResponseEntity<ApiResponse<UserDetailResponse>> updateProfile(
			@RequestBody UserProfileUpdateRequestDTO request) {
		UserDetailResponse updatedUser = userService.updateUserProfile(request);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "Profile updated successfully",
				updatedUser);
		return ResponseEntity.status(200).body(response);
	}

	@PutMapping("/password")
	public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequestDTO request) {
		userService.changePassword(request);
		ApiResponse<String> response = new ApiResponse<>("1000", "Password changed successfully", null);
		return ResponseEntity.status(200).body(response);
	}
}