package com.mochamates.web.entities.products;

import java.util.Date;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("GROUND")
public class GroundCoffee extends CoffeeProduct {
	private Double weight;
	private String roastLevel;
	private boolean isWholeBean;

	public GroundCoffee() {
		super();
	}

	public GroundCoffee(String name, String description, Double price, String imageUrl, String type, Date create_at,
			Date update_at, Double weight, String roastLevel, boolean isWholeBean) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.weight = weight;
		this.roastLevel = roastLevel;
		this.isWholeBean = isWholeBean;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getRoastLevel() {
		return roastLevel;
	}

	public void setRoastLevel(String roastLevel) {
		this.roastLevel = roastLevel;
	}

	public boolean isWholeBean() {
		return isWholeBean;
	}

	public void setWholeBean(boolean isWholeBean) {
		this.isWholeBean = isWholeBean;
	}

}
