package com.mochamates.web.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.auth.RefreshTokenResponse;
import com.mochamates.web.dto.auth.UserLoginRequest;
import com.mochamates.web.dto.auth.UserLoginResponse;
import com.mochamates.web.dto.auth.UserRegistrationRequest;
import com.mochamates.web.dto.auth.VerificaionRequest;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Controller responsible for handling user authentication-related endpoints
 * such as Login, registration, token refresh, and email verification.
 * 
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	private AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	/**
	 * Handles user login. Returns access and refresh tokens upon success. The
	 * refresh token is stored as an HTTP-only secure cookie.
	 * 
	 * @param userLoginRequest the login credentials ((email or username) and
	 *                         password)
	 * @param response         the HTTP response used to set the refresh token
	 *                         cookie
	 * @return a response containing user data and access token
	 */
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<UserLoginResponse>> login(@RequestBody UserLoginRequest userLoginRequest,
			HttpServletResponse response) {
		Map<String, String> tokens = authService.login(userLoginRequest);

		Cookie cookie = new Cookie("refresh_token", tokens.get("refreshToken"));
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setMaxAge(7 * 24 * 60 * 60);
		cookie.setPath("api/v1/auth");
		cookie.setAttribute("SameSite", "Strict");
		response.addCookie(cookie);

		UserLoginResponse userLoginResponse = new UserLoginResponse();
		userLoginResponse.setAccessToken(tokens.get("accessToken"));

		ApiResponse<UserLoginResponse> apiResponse = new ApiResponse<UserLoginResponse>("1000", "Ok",
				userLoginResponse);
		return ResponseEntity.status(200).body(apiResponse);
	}

	/**
	 * Handles new user registration.
	 * 
	 * @param userRegistrationRequest user details such as email, username,
	 *                                password, etc
	 * @return a success response with status 201
	 */
	@PostMapping("/register")
	public ResponseEntity<ApiResponse<String>> registerUser(
			@RequestBody UserRegistrationRequest userRegistrationRequest) {
		authService.registerUser(userRegistrationRequest);
		ApiResponse<String> response = new ApiResponse<String>("1000", "Ok", null);

		return ResponseEntity.status(201).body(response);
	}

	/**
	 * Refreshes the user's access token using the refresh token stored in cookies
	 * 
	 * @param refreshToken the refresh token from the HTTP cookie
	 * @return a new access token and optional updated refresh token
	 */
	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
			@CookieValue(name = "refresh_token") String refreshToken) {
		RefreshTokenResponse response = authService.refreshToken(refreshToken);

		ApiResponse<RefreshTokenResponse> apiResponse = new ApiResponse<RefreshTokenResponse>("1000", "OK", response);

		return ResponseEntity.status(200).body(apiResponse);
	}

	/**
	 * Verifies a user's email using the verification code sent to them.
	 * 
	 * @param verificaionRequest contains email and verification code
	 * @return a success response upon successful verification
	 */
	@PostMapping("/verify")
	public ResponseEntity<ApiResponse<String>> verification(@RequestBody VerificaionRequest verificaionRequest) {
		authService.verification(verificaionRequest);
		ApiResponse<String> response = new ApiResponse<String>("1000", "OK", null);
		return ResponseEntity.status(200).body(response);
	}

	/**
	 * Requests a new verification code for the given email address.
	 * 
	 * @param verificaionRequest contains the user's email
	 * @return a response indication the code has been re-sent
	 */
	@PostMapping("/getVerify")
	public ResponseEntity<ApiResponse<String>> getVerificationEntity(
			@RequestBody VerificaionRequest verificaionRequest) {
		authService.reGenerateCode(verificaionRequest.getUsernameOrEmail());

		ApiResponse<String> response = new ApiResponse<String>("1000", "OK", null);

		return ResponseEntity.status(200).body(response);

	}
}
