package com.mochamates.web.entities.products;

import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

public class GroundFactory implements CoffeeFactory {
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		return new GroundCoffee(productDTO.getName(), productDTO.getDescription(), productDTO.getPrice(),
				productDTO.getImageUrl(), "GROUND_COFFEE", LocalDateTime.now(), null,
				productDTO.getSpecificAttributesDTO().getOrigin(),
				productDTO.getSpecificAttributesDTO().getRoastLevel(),
				productDTO.getSpecificAttributesDTO().getRoastDate());
	}
}
