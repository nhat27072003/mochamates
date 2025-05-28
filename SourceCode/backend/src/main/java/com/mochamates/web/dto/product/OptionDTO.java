package com.mochamates.web.dto.product;

import java.util.List;

public class OptionDTO {
	private Long id;
	private String name;
	private String type;
	private boolean required;

	private List<OptionValueDTO> values;

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public boolean isRequired() {
		return required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public List<OptionValueDTO> getValues() {
		return values;
	}

	public void setValues(List<OptionValueDTO> values) {
		this.values = values;
	}

}
