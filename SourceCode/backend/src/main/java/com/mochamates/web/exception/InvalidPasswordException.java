package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class InvalidPasswordException extends MochaMatesException {
	public InvalidPasswordException() {
		super("Invalid password", HttpStatus.BAD_REQUEST, "5000");
	}
}
