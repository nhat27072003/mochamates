package com.mochamates.web.entities.products;

import java.util.Date;

import com.mochamates.web.dto.product.ProductDTO;

public class PackagedCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		PackagedCoffee coffee = new PackagedCoffee(productDTO.getName(), productDTO.getDescription(),
				productDTO.getPrice(), productDTO.getImageUrl(), "PACKAGED_COFFEE", new Date(), null,
				productDTO.getWeight(), productDTO.getBrand(), productDTO.getStock());
		return coffee;

	}
}
