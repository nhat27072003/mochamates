package com.mochamates.web.dto.auth;

public class UserLoginResponse {
	private String accessToken;

	public String getRefreshToken() {
		return accessToken;
	}

	public void setRefreshToken(String accessToken) {
		this.accessToken = accessToken;
	}

}
