package com.mochamates.web.entities.products;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("GROUND_COFFEE")
public class GroundCoffee extends CoffeeProduct {
	private String origin;
	private String roastLevel;
	private LocalDate roastDate;

	public GroundCoffee() {
		super();
	}

	public GroundCoffee(String name, String description, Double price, String imageUrl, String type,
			LocalDateTime create_at, LocalDateTime update_at, String origin, String roastLevel, LocalDate roastDate) {
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

	public LocalDate getRoastDate() {
		return roastDate;
	}

	public void setRoastDate(LocalDate roastDate) {
		this.roastDate = roastDate;
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		this.setOrigin(productDTO.getSpecificAttributesDTO().getOrigin());
		this.setRoastDate(productDTO.getSpecificAttributesDTO().getRoastDate());
		this.setRoastLevel(productDTO.getSpecificAttributesDTO().getRoastLevel());

	}

}
