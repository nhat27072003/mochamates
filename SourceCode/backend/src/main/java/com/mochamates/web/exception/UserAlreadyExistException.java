package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistException extends MochaMatesException {
	public UserAlreadyExistException() {
		super("User already exist", HttpStatus.BAD_REQUEST, "1002");
	}

	public UserAlreadyExistException(String exception) {
		super(exception, HttpStatus.BAD_REQUEST, "1002");
	}
}
