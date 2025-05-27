package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class OrderStatusException extends MochaMatesException {
	public OrderStatusException() {
		super("Error Order Status Exception", HttpStatus.BAD_REQUEST, "3005");
	}

	public OrderStatusException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "3005");
	}
}
