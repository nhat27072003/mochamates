package com.mochamates.web.dto.product;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class ProductResponseDTO {
	private Long id;
	private String name;
	private String description;
	private Double price;
	private String imageUrl;
	private Date updateAt;
	private String type;
	private Map<String, Object> specificAttributes;
	private List<OptionDTO> options;

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Date getUpdateAt() {
		return updateAt;
	}

	public void setUpdateAt(Date updateAt) {
		this.updateAt = updateAt;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Map<String, Object> getSpecificAttributes() {
		return specificAttributes;
	}

	public void setSpecificAttributes(Map<String, Object> specificAttributes) {
		this.specificAttributes = specificAttributes;
	}

	public List<OptionDTO> getOptions() {
		return options;
	}

	public void setOptions(List<OptionDTO> options) {
		this.options = options;
	}
}