package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class OrderCreateException extends MochaMatesException {
	public OrderCreateException() {
		super("Create Order fail exceptin", HttpStatus.BAD_REQUEST, "3003");
	}

	public OrderCreateException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "3003");
	}
}
