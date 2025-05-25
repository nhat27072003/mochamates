package com.mochamates.web.entities.products;

import java.util.Date;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("GROUND_COFFEE")
public class GroundCoffee extends CoffeeProduct {
	private String origin;
	private String roastLevel;
	private String roastDate;

	public GroundCoffee() {
		super();
	}

	public GroundCoffee(String name, String description, Double price, String imageUrl, String type, Date create_at,
			Date update_at, String origin, String roastLevel, String roastDate) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.roastLevel = roastLevel;
		this.origin = origin;
		this.roastDate = roastDate;
	}

	public String getRoastLevel() {
		return roastLevel;
	}

	public void setRoastLevel(String roastLevel) {
		this.roastLevel = roastLevel;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getRoastDate() {
		return roastDate;
	}

	public void setRoastDate(String roastDate) {
		this.roastDate = roastDate;
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		this.setOrigin(productDTO.getOrigin());
		this.setRoastDate(productDTO.getRoastDate());
		this.setRoastLevel(productDTO.getRoastLevel());

	}

}
