package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class OrderNotFoundException extends MochaMatesException {
	public OrderNotFoundException() {
		super("Order not found exception", HttpStatus.BAD_REQUEST, "3003");
	}
}
