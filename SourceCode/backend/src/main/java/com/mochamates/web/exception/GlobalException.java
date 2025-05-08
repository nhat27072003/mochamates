package com.mochamates.web.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.mochamates.web.response.ApiResponse;

@RestControllerAdvice
public class GlobalException {

	@ExceptionHandler(MochaMatesException.class)
	public ResponseEntity<ApiResponse<String>> handleMochaMatesException(MochaMatesException ex) {
		return ResponseEntity.status(ex.getHttpStatus())
				.body(new ApiResponse<>(ex.getErrorCode(), ex.getMessage(), null));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse<String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		String param = ex.getName();
		String message = String.format("Invalid value for parameter '%s'. Expected a number.", param);
		return ResponseEntity.badRequest().body(new ApiResponse<>("2000", message, null));

	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse<String>> handleInvalidFormat(HttpMessageNotReadableException ex) {

		return ResponseEntity.badRequest()
				.body(new ApiResponse<String>("2000", "Invalid parameter type: " + ex.getMessage(), null));
	}
}
