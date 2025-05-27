package com.mochamates.web.dto.cart;

import java.util.List;

import com.mochamates.web.dto.product.OptionDTO;

public class CartItemUpdateRequestDTO {
	private Integer quantity;
	private List<OptionDTO> selectedOptions;

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
