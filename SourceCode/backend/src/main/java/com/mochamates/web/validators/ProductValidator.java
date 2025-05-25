package com.mochamates.web.validators;

import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.exception.InvalidProductInfoException;

public class ProductValidator {
	private ProductDTO product;

	public ProductValidator(ProductDTO productDTO) {
		this.product = productDTO;
	}

	public boolean validateProduct() {
		if (product == null) {
			throw new InvalidProductInfoException("Product cannot be null");
		}
		if (isNullOrEmpty(product.getName())) {
			throw new InvalidProductInfoException("Product name cannot be empty");
		}
		if (isNullOrEmpty(product.getDescription())) {
			throw new InvalidProductInfoException("Product description cannot be empty");
		}
		if (isNullOrEmpty(product.getImageUrl())) {
			throw new InvalidProductInfoException("Product image URL cannot be empty");
		}
		if (isNullOrEmpty(product.getType())) {
			throw new InvalidProductInfoException("Product type cannot be empty");
		}

		if (product.getPrice() == null || product.getPrice() <= 0) {
			throw new InvalidProductInfoException("Product price must be greater than 0");
		}

		switch (product.getType()) {
		case "READY_TO_DRINK_COFFEE":

			break;
		case "PACKAGED_COFFEE":
		case "GROUND_COFFEE":

			break;
		default:
			throw new InvalidProductInfoException("Unsupported product type: " + product.getType());
		}

		return true;
	}

	private boolean isNullOrEmpty(String str) {
		return str == null || str.trim().isEmpty();
	}
}
