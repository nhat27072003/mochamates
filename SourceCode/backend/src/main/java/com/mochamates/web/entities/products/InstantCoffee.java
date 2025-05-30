package com.mochamates.web.entities.products;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("INSTANT_COFFEE")
public class InstantCoffee extends CoffeeProduct {

	private String packType;
	private String instructions;
	private LocalDate expireDate;

	public InstantCoffee() {
		super();
	}

	public InstantCoffee(String name, String description, Double price, String imageUrl, String type,
			LocalDateTime create_at, LocalDateTime update_at, String packType, String instructions,
			LocalDate expireDate) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.packType = packType;
		this.instructions = instructions;
		this.expireDate = expireDate;
	}

	public String getPackType() {
		return packType;
	}

	public void setPackType(String packType) {
		this.packType = packType;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public LocalDate getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(LocalDate expireDate) {
		this.expireDate = expireDate;
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		this.setPackType(productDTO.getSpecificAttributesDTO().getPackType());
		this.setExpireDate(productDTO.getSpecificAttributesDTO().getExpireDate());
		this.setInstructions(productDTO.getSpecificAttributesDTO().getInstructions());
	}

	@Override
	public double calculatePrice(String valud) {
		return price;
	}

	public List<Map<String, Object>> getOptionsWithPrices() {
		return null;
	}
}
