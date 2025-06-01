package com.mochamates.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.user.GetUsersResponseDTO;
import com.mochamates.web.dto.user.UserCreateRequestDTO;
import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.dto.user.UserUpdateRequestDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.UserService;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
	private final UserService userService;

	public AdminUserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping()
	public ResponseEntity<ApiResponse<UserDetailResponse>> createUser(@RequestBody UserCreateRequestDTO request) {
		UserDetailResponse createdUser = userService.createUser(request);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "User created successfully", createdUser);
		return ResponseEntity.status(201).body(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailResponse>> updateUser(@PathVariable Long id,
			@RequestBody UserUpdateRequestDTO request) {
		UserDetailResponse updatedUser = userService.updateUser(id, request);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "User updated successfully", updatedUser);
		return ResponseEntity.status(200).body(response);
	}

	@GetMapping()
	public ResponseEntity<ApiResponse<GetUsersResponseDTO>> getListUsers(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		GetUsersResponseDTO responseDTO = userService.getUsers(page, size);
		ApiResponse<GetUsersResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/by-role")
	public ResponseEntity<ApiResponse<GetUsersResponseDTO>> getUsersByRole(@RequestParam(required = false) String role,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		GetUsersResponseDTO responseDTO = userService.getUsersByRole(role, page, size);
		ApiResponse<GetUsersResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailResponse>> getUserById(@PathVariable Long id) {
		UserDetailResponse user = userService.getUserById(id);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "Ok", user);
		return ResponseEntity.status(200).body(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<UserDetailResponse>> deleteUser(@PathVariable Long id) {
		UserDetailResponse deletedUser = userService.deleteUser(id);
		ApiResponse<UserDetailResponse> response = new ApiResponse<>("1000", "User deleted successfully", deletedUser);
		return ResponseEntity.status(200).body(response);
	}
}