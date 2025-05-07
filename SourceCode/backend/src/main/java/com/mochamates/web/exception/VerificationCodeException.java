package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class VerificationCodeException extends MochaMatesException {

	public VerificationCodeException() {
		super("Verify code ", HttpStatus.BAD_REQUEST, "1003");
	}

}
