package com.mochamates.web.controllers.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.user.UserDetailResponse;
import com.mochamates.web.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/user/me")
public class UserController {

	@GetMapping()
	public ResponseEntity<ApiResponse<UserDetailResponse>> getUserProfile() {

		ApiResponse<UserDetailResponse> response = new ApiResponse<UserDetailResponse>(null, null, null);

		return ResponseEntity.status(200).body(response);
	}

//	@PutMapping()
//	public ResponseEntity<ApiResponse<UpdateUserProfileResponse>> updateUserProfile(
//			@RequestBody UpdateUserProfileRequest updateUserProfileRequest) {
//
//	}

}
