package com.mochamates.web.entities.products;

import java.util.Date;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PACKAGED")
public class PackagedCoffee extends CoffeeProduct {
	private Double weight;
	private String brand;
	private int stock;

	public PackagedCoffee() {
		super();
	}

	public PackagedCoffee(String name, String description, Double price, String imageUrl, String type, Date create_at,
			Date update_at, Double weitght, String brand, int stock) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.brand = brand;
		this.stock = stock;
		this.weight = weitght;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}
}
