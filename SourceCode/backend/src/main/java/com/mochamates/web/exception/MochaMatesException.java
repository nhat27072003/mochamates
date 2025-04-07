package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class MochaMatesException extends RuntimeException {
	private final HttpStatus status;
	private String errorCode;

	public MochaMatesException(String exception, HttpStatus status, String errorCode) {
		super(exception);
		this.status = status;
		this.errorCode = errorCode;
	}

	public HttpStatus getHttpStatus() {
		return status;
	}

	public String getErrorCode() {
		return errorCode;
	}
}
