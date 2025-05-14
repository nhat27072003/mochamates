package com.mochamates.web.dto.auth;

public class VerificaionRequest {
	private String usernameOrEmail;
	private String code;

	public VerificaionRequest() {

	}

	public VerificaionRequest(String username, String code) {
		this.usernameOrEmail = username;

		this.code = code;
	}

	public String getUsernameOrEmail() {
		return usernameOrEmail;
	}

	public void setUsernameOrEmail(String usernameOrEmail) {
		this.usernameOrEmail = usernameOrEmail;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
