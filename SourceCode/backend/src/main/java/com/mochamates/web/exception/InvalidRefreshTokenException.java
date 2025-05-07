package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class InvalidRefreshTokenException extends MochaMatesException {
	public InvalidRefreshTokenException() {
		super("Invalid refresh token", HttpStatus.BAD_REQUEST, "2000");
	}
}
