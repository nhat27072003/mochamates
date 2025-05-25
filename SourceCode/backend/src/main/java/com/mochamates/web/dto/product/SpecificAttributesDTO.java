package com.mochamates.web.dto.product;

import java.time.LocalDate;

public class SpecificAttributesDTO {

	// READY_TO_DRINK_COFFEE
	private String drinkType;
	private String ingredients;
	private String preparationTime;

	// GROUND_COFFEE
	private String roastLevel;
	private String origin;
	private LocalDate roastDate;

	// PACKAGED_COFFEE
	private String packType;
	private String instructions;
	private LocalDate expireDate;

	// Getters and Setters
	public String getDrinkType() {
		return drinkType;
	}

	public void setDrinkType(String drinkType) {
		this.drinkType = drinkType;
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
}