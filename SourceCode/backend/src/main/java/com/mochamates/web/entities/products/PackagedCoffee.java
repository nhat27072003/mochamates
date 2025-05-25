package com.mochamates.web.entities.products;

import java.util.Date;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PACKAGED_COFFEE")
public class PackagedCoffee extends CoffeeProduct {
	private String packType;
	private String instructions;
	private String expireDate;

	public PackagedCoffee() {
		super();
	}

	public PackagedCoffee(String name, String description, Double price, String imageUrl, String type, Date create_at,
			Date update_at, String packType, String instructions, String expireDate) {
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

	public String getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(String expireDate) {
		this.expireDate = expireDate;
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		this.setPackType(productDTO.getPackType());
		this.setExpireDate(productDTO.getExpireDate());
		this.setInstructions(productDTO.getInstructions());
	}

}
