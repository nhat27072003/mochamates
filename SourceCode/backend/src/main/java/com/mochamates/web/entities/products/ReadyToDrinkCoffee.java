package com.mochamates.web.entities.products;

import java.time.LocalDateTime;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("READY_TO_DRINK_COFFEE")
public class ReadyToDrinkCoffee extends CoffeeProduct {
	private String ingredients;
	private String preparationTime;
	private String drinkType;

	public ReadyToDrinkCoffee() {
		super();
	}

	public ReadyToDrinkCoffee(String name, String description, Double price, String imageUrl, String type,
			LocalDateTime create_at, LocalDateTime update_at, String drinkType, String ingredients,
			String preparationTime) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.drinkType = drinkType;
		this.preparationTime = preparationTime;
		this.ingredients = ingredients;
	}

	public String getIngredients() {
		return ingredients;
	}

	public void setIngredients(String ingredients) {
		this.ingredients = ingredients;
	}

	public String getPreparationTime() {
		return preparationTime;
	}

	public void setPreparationTime(String preparationTime) {
		this.preparationTime = preparationTime;
	}

	public String getDrinkType() {
		return drinkType;
	}

	public void setDrinkType(String drinkType) {
		this.drinkType = drinkType;
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		this.setDrinkType(productDTO.getSpecificAttributesDTO().getDrinkType());
		this.setIngredients(productDTO.getSpecificAttributesDTO().getIngredients());
		this.setPreparationTime(productDTO.getSpecificAttributesDTO().getPreparationTime());
	}

}
