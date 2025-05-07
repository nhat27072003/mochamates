package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class InvalidProductInfoException extends MochaMatesException {
	public InvalidProductInfoException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "2001");
	}

	public InvalidProductInfoException() {
		super("Invalid product info", HttpStatus.BAD_REQUEST, "2001");
	}
}
