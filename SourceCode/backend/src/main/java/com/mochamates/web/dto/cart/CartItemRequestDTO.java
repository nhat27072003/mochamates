package com.mochamates.web.dto.cart;

import java.util.List;

import com.mochamates.web.dto.product.OptionDTO;

public class CartItemRequestDTO {
	private Long productId;
	private String name;
	private Double price;
	private String imageUrl;
	private List<OptionDTO> selectedOptions;
	private Integer quantity;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public List<OptionDTO> getSelectedOptions() {
		return selectedOptions;
	}

	public void setSelectedOptions(List<OptionDTO> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

}
