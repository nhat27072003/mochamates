package com.mochamates.web.dto.order;

import java.util.List;

import com.mochamates.web.dto.product.OptionDTO;

public class OrderItemDTO {
	private Long id;
	private Long productId;
	private String name;
	private Double price;
	private Double totalPrice;
	private String imageUrl;
	private Integer quantity;
	private List<OptionDTO> selectedOptions;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public List<OptionDTO> getSelectedOptions() {
		return selectedOptions;
	}

	public void setSelectedOptions(List<OptionDTO> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}

}
