package com.mochamates.web.dto.auth;

public class UserLoginRequest {
	private String username;
	private String email;
	private String password;

	public UserLoginRequest(String usernameString, String emailString, String passwordString) {
		this.username = usernameString;
		this.email = emailString;
		this.password = passwordString;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
