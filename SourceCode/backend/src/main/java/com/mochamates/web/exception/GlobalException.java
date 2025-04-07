package com.mochamates.web.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mochamates.web.response.ApiResponse;

@RestControllerAdvice
public class GlobalException {

	@ExceptionHandler(MochaMatesException.class)
	public ResponseEntity<ApiResponse<String>> handleMochaMatesException(MochaMatesException ex) {
		return ResponseEntity.status(ex.getHttpStatus())
				.body(new ApiResponse<>(ex.getErrorCode(), ex.getMessage(), null));
	}
}
