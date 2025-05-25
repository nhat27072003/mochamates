package com.mochamates.web.entities.products;

import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

public class ReadyToDrinkCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		return new ReadyToDrinkCoffee(productDTO.getName(), productDTO.getDescription(), productDTO.getPrice(),
				productDTO.getImageUrl(), "READY_TO_DRINK_COFFEE", LocalDateTime.now(), null,
				productDTO.getSpecificAttributesDTO().getDrinkType(),
				productDTO.getSpecificAttributesDTO().getIngredients(),
				productDTO.getSpecificAttributesDTO().getPreparationTime());
	}
}
