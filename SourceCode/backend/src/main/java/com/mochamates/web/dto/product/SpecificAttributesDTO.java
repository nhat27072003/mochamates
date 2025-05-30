package com.mochamates.web.dto.product;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class SpecificAttributesDTO {

	// READY_TO_DRINK_COFFEE
	private Set<String> iceLevels;
	private Set<String> sugarLevels;
	private Set<String> sizeOptions;

	// ROASTED_COFFEE
	private Set<String> roastLevels;
	private String origin;
	private LocalDate roastDate;
	private String composition;
	private Set<String> grindLevels;
	private Set<String> weights;

	// INSTANT_COFFEE
	private String packType;
	private String instructions;
	private LocalDate expireDate;

	// Getters and Setters

	public Set<String> getIceLevels() {
		return iceLevels != null ? new HashSet<>(iceLevels) : new HashSet<>();
	}

	public void setIceLevels(Set<String> iceLevels) {
		this.iceLevels = iceLevels != null ? new HashSet<>(iceLevels) : new HashSet<>();
	}

	public Set<String> getSugarLevels() {
		return sugarLevels != null ? new HashSet<>(sugarLevels) : new HashSet<>();
	}

	public void setSugarLevels(Set<String> sugarLevels) {
		this.sugarLevels = sugarLevels != null ? new HashSet<>(sugarLevels) : new HashSet<>();
	}

	public Set<String> getSizeOptions() {
		return sizeOptions != null ? new HashSet<>(sizeOptions) : new HashSet<>();
	}

	public void setSizeOptions(Set<String> sizeOptions) {
		this.sizeOptions = sizeOptions != null ? new HashSet<>(sizeOptions) : new HashSet<>();
	}

	public Set<String> getRoastLevels() {
		return roastLevels != null ? new HashSet<>(roastLevels) : new HashSet<>();
	}

	public void setRoastLevels(Set<String> roastLevels) {
		this.roastLevels = roastLevels != null ? new HashSet<>(roastLevels) : new HashSet<>();
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public LocalDate getRoastDate() {
		return roastDate;
	}

	public void setRoastDate(LocalDate roastDate) {
		this.roastDate = roastDate;
	}

	public String getComposition() {
		return composition;
	}

	public void setComposition(String composition) {
		this.composition = composition;
	}

	public Set<String> getGrindLevels() {
		return grindLevels != null ? new HashSet<>(grindLevels) : new HashSet<>();
	}

	public void setGrindLevels(Set<String> grindLevels) {
		this.grindLevels = grindLevels != null ? new HashSet<>(grindLevels) : new HashSet<>();
	}

	public Set<String> getWeights() {
		return weights != null ? new HashSet<>(weights) : new HashSet<>();
	}

	public void setWeights(Set<String> weights) {
		this.weights = weights != null ? new HashSet<>(weights) : new HashSet<>();
	}

	public String getPackType() {
		return packType;
	}

	public void setPackType(String packType) {
		this.packType = packType;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public LocalDate getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(LocalDate expireDate) {
		this.expireDate = expireDate;
	}
}