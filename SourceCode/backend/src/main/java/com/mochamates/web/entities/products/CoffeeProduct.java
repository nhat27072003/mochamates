package com.mochamates.web.entities.products;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
public abstract class CoffeeProduct {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	protected Long id;

	protected String name;
	protected String description;
	protected Double price;
	protected String imageUrl;
	@Column(name = "create_at")
	protected LocalDateTime createAt;
	@Column(name = "update_at")
	protected LocalDateTime updateAt;

	@Column(name = "type", insertable = false, updatable = false)
	protected String type;

	@OneToMany(mappedBy = "coffeeProduct", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	protected List<ProductOption> options;

	public CoffeeProduct() {
	}

	public CoffeeProduct(String name, String description, Double price, String imageUrl, LocalDateTime create_at,
			LocalDateTime update_at) {
		this.name = name;
		this.description = description;
		this.price = price;
		this.imageUrl = imageUrl;
		this.createAt = create_at;
		this.updateAt = update_at;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public LocalDateTime getCreateAt() {
		return createAt;
	}

	public void setCreateAt(LocalDateTime create_at) {
		this.createAt = create_at;
	}

	public LocalDateTime getUpdateAt() {
		return updateAt;
	}

	public void setUpdateAt(LocalDateTime update_at) {
		this.updateAt = update_at;
	}

	public String getType() {
		return type;
	}

	public List<ProductOption> getOptions() {
		return options;
	}

	public void setOptions(List<ProductOption> options) {
		this.options = options;
	}

	public void updateFromDTO(ProductDTO productDTO) {
		this.name = productDTO.getName();
		this.description = productDTO.getDescription();
		this.price = productDTO.getPrice();
	}

	public abstract double calculatePrice(String value);

	public abstract List<Map<String, Object>> getOptionsWithPrices();
}