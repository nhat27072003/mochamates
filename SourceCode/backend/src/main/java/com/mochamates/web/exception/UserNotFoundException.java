package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends MochaMatesException {
	public UserNotFoundException() {
		super("User not found exception", HttpStatus.BAD_REQUEST, "2001");
	}

	public UserNotFoundException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "2002");
	}
}
