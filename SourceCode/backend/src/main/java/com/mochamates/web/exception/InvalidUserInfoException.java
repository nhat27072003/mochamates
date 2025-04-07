package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class InvalidUserInfoException extends MochaMatesException {
	public InvalidUserInfoException() {
		super("Invalid user info", HttpStatus.BAD_REQUEST, "1001");
	}

	public InvalidUserInfoException(String error) {
		super(error, HttpStatus.BAD_REQUEST, "1001");
	}
}
