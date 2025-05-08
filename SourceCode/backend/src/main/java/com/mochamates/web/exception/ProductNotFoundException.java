package com.mochamates.web.exception;

import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends MochaMatesException {
	public ProductNotFoundException() {
		super("Product not found", HttpStatus.NOT_FOUND, "2002");
	}
}
