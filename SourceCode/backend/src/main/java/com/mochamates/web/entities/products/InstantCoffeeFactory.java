package com.mochamates.web.entities.products;

import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

public class InstantCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		InstantCoffee coffee = new InstantCoffee(productDTO.getName(), productDTO.getDescription(),
				productDTO.getPrice(), productDTO.getImageUrl(), "INSTANT_COFFEE", LocalDateTime.now(),
				LocalDateTime.now(), productDTO.getSpecificAttributesDTO().getPackType(),
				productDTO.getSpecificAttributesDTO().getInstructions(),
				productDTO.getSpecificAttributesDTO().getExpireDate());
		return coffee;
	}
}
