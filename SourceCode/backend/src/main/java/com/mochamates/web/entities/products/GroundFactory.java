package com.mochamates.web.entities.products;

import java.util.Date;

import com.mochamates.web.dto.product.ProductDTO;

public class GroundFactory implements CoffeeFactory {
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		return new GroundCoffee(productDTO.getName(), productDTO.getDescription(), productDTO.getPrice(),
				productDTO.getImageUrl(), "GROUND_COFFEE", new Date(), null, productDTO.getOrigin(),
				productDTO.getRoastLevel(), productDTO.getRoastDate());
	}
}
