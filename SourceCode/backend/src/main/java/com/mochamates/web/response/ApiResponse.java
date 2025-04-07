package com.mochamates.web.response;

public class ApiResponse<T> {
	private String statusCode;
	private String message;
	private T dataT;

	public ApiResponse(String statusCode, String message, T data) {
		this.statusCode = statusCode;
		this.message = message;
		this.dataT = data;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public String getMessage() {
		return message;
	}

	public T getData() {
		return dataT;
	}
}
