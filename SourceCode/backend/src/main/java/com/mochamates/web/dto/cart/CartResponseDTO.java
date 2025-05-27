package com.mochamates.web.dto.cart;

import java.util.List;

public class CartResponseDTO {
	private Long id;
	private String userId;
	private List<CartItemDTO> items;
	private Double subtotal;
	private Double shipping;
	private Double total;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public List<CartItemDTO> getItems() {
		return items;
	}

	public void setItems(List<CartItemDTO> items) {
		this.items = items;
	}

	public Double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(Double subtoal) {
		this.subtotal = subtoal;
	}

	public Double getShipping() {
		return shipping;
	}

	public void setShipping(Double shipping) {
		this.shipping = shipping;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

}
