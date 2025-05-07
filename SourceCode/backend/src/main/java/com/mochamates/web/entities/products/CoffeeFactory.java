package com.mochamates.web.entities.products;

import com.mochamates.web.dto.product.ProductDTO;

public interface CoffeeFactory {

	public abstract CoffeeProduct createCoffee(ProductDTO productDTO);

}
