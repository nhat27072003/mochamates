package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class EmailNotVerifiedException extends MochaMatesException {
	public EmailNotVerifiedException() {
		super("User not verified by email verification code", HttpStatus.BAD_REQUEST, "1006");
	}
}
