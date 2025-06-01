package com.mochamates.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.user.ChangePasswordRequestDTO;
import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.dto.user.UserProfileUpdateRequestDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.UserService;

/**
 * REST controller for managing user-related operations for authenticated users.
 * Provides endpoints for updating user profile and changing password.
 * 
 * Base path: /api/v1/users
 */
@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Updates the authenticated user's profile information.
	 * 
	 * @param request the UserProfileUpdateRequestDTO containing updated email and
	 *                phone
	 * @return a ResponseEntity containing an ApiResponse with the updated user
	 *         details
	 */
	@PutMapping("/profile")
	public ResponseEntity<ApiResponse<UserDetailResponse>> updateProfile(
			@RequestBody UserProfileUpdateRequestDTO request) {
		UserDetailResponse updatedUser = userService.updateUserProfile(request);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "Profile updated successfully",
				updatedUser);
		return ResponseEntity.status(200).body(response);
	}

	/**
	 * Changes the authenticated user's password.
	 * 
	 * @param request the ChangePasswordRequestDTO containing old and new password
	 * @return a ResponseEntity containing an ApiResponse with a success message
	 */
	@PutMapping("/password")
	public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequestDTO request) {
		userService.changePassword(request);
		ApiResponse<String> response = new ApiResponse<>("1000", "Password changed successfully", null);
		return ResponseEntity.status(200).body(response);
	}
}