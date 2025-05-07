package com.mochamates.web.entities.products;

import java.util.Date;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("READY_TO_DRINK")
public class ReadyToDrinkCoffee extends CoffeeProduct {
	private Double volume;
	private boolean isCold;

	public ReadyToDrinkCoffee() {
		super();
	}

	public ReadyToDrinkCoffee(String name, String description, Double price, String imageUrl, String type,
			Date create_at, Date update_at, Double volume, boolean isCold) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.volume = volume;
		this.isCold = isCold;
	}

	public Double getVolume() {
		return volume;
	}

	public void setVolume(Double volume) {
		this.volume = volume;
	}

	public boolean isCold() {
		return isCold;
	}

	public void setCold(boolean isCold) {
		this.isCold = isCold;
	}

}
