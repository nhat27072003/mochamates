package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class InvalidVerificationCode extends MochaMatesException {
	public InvalidVerificationCode() {
		super("Invalid Verification code", HttpStatus.BAD_REQUEST, "1004");
	}
}
