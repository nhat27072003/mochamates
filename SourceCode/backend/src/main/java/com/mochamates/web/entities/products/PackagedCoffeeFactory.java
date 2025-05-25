package com.mochamates.web.entities.products;

import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

public class PackagedCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		PackagedCoffee coffee = new PackagedCoffee(productDTO.getName(), productDTO.getDescription(),
				productDTO.getPrice(), productDTO.getImageUrl(), "PACKAGED_COFFEE", LocalDateTime.now(), null,
				productDTO.getSpecificAttributesDTO().getPackType(),
				productDTO.getSpecificAttributesDTO().getInstructions(),
				productDTO.getSpecificAttributesDTO().getExpireDate());
		return coffee;

	}
}
