package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class ReviewException extends MochaMatesException {
	public ReviewException() {
		super("Review error exception", HttpStatus.BAD_REQUEST, "4000");

	}

	public ReviewException(String message) {
		super(message, HttpStatus.BAD_REQUEST, "4000");
	}
}
