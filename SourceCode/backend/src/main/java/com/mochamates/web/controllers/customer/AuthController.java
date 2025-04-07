package com.mochamates.web.controllers.customer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.UserRegistrationRequest;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	private AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<String>> registerUser(
			@RequestBody UserRegistrationRequest userRegistrationRequest) {
		authService.registerUser(userRegistrationRequest);
		ApiResponse<String> response = new ApiResponse<String>("1000", "Ok", null);

		return ResponseEntity.status(201).body(response);
	}
}
