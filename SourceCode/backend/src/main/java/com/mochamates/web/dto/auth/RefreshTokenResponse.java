package com.mochamates.web.dto.auth;

public class RefreshTokenResponse {
	private String accessToken;
	private String username;
	private String role;

	public RefreshTokenResponse(String accessToken, String username) {
		this.accessToken = accessToken;
		this.username = username;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

}
