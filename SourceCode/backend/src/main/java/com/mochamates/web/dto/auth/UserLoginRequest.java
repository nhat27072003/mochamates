package com.mochamates.web.dto.auth;

public class UserLoginRequest {
	private String usernameOrEmail;
	private String password;

	public UserLoginRequest(String usernameOrEmail, String passwordString) {
		this.usernameOrEmail = usernameOrEmail;
		this.password = passwordString;
	}

	public String getUsernameOrEmail() {
		return usernameOrEmail;
	}

	public void setUsernameOrEmail(String username) {
		this.usernameOrEmail = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
