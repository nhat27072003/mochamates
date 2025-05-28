package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class CartException extends MochaMatesException {
	public CartException() {
		super("Some thing error cart", HttpStatus.BAD_REQUEST, "3003");
	}

	public CartException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "3003");
	}
}
