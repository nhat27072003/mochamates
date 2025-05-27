package com.mochamates.web.dto.cart;

import java.util.List;

import com.mochamates.web.dto.product.OptionDTO;

public class DeleteCartItemRequestDTO {
	private List<OptionDTO> selectedOptions;

	public List<OptionDTO> getSelectedOptions() {
		return selectedOptions;
	}

	public void setSelectedOptions(List<OptionDTO> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}

}
