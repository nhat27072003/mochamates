package com.mochamates.web.dto.order;

import java.util.List;
import java.util.Map;

public class OrderItemDTO {
	private Long id;
	private Long productId;
	private String name;
	private Double price;
	private Double totalPrice;
	private String imageUrl;
	private Integer quantity;
	private Map<String, List<String>> selectedOptions;

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

	public Map<String, List<String>> getSelectedOptions() {
		return selectedOptions;
	}

	public void setSelectedOptions(Map<String, List<String>> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}
}
