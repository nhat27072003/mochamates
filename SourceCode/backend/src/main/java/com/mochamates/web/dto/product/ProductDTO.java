package com.mochamates.web.dto.product;

import java.util.List;

public class ProductDTO {
	private Long id;
	private String name;
	private String description;
	private Double price;
	private String imageUrl;
	private String type;

	private SpecificAttributesDTO specificAttributesDTO = new SpecificAttributesDTO();
	private List<OptionDTO> options;

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

	public SpecificAttributesDTO getSpecificAttributesDTO() {
		return specificAttributesDTO;
	}

	public void setSpecificAttributesDTO(SpecificAttributesDTO specificAttributesDTO) {
		this.specificAttributesDTO = specificAttributesDTO;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<OptionDTO> getOptions() {
		return options;
	}

	public void setOptions(List<OptionDTO> options) {
		this.options = options;
	}

}
