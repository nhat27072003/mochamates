package com.mochamates.web.dto.product;

import java.util.List;

public class SelectedAttributesDTO {
	private List<String> roastLevels;
	private List<String> grindLevels;
	private List<String> weights;
	private List<String> iceLevels;
	private List<String> sugarLevels;
	private List<String> sizeOptions;

	public List<String> getRoastLevels() {
		return roastLevels;
	}

	public void setRoastLevels(List<String> roastLevels) {
		this.roastLevels = roastLevels;
	}

	public List<String> getGrindLevels() {
		return grindLevels;
	}

	public void setGrindLevels(List<String> grindLevels) {
		this.grindLevels = grindLevels;
	}

	public List<String> getWeights() {
		return weights;
	}

	public void setWeights(List<String> weights) {
		this.weights = weights;
	}

	public List<String> getIceLevels() {
		return iceLevels;
	}

	public void setIceLevels(List<String> iceLevels) {
		this.iceLevels = iceLevels;
	}

	public List<String> getSugarLevels() {
		return sugarLevels;
	}

	public void setSugarLevels(List<String> sugarLevels) {
		this.sugarLevels = sugarLevels;
	}

	public List<String> getSizeOptions() {
		return sizeOptions;
	}

	public void setSizeOptions(List<String> sizeOptions) {
		this.sizeOptions = sizeOptions;
	}
}
