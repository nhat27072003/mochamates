package com.mochamates.web.entities.products;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.mochamates.web.dto.product.ProductDTO;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;

@Entity
@DiscriminatorValue("READY_TO_DRINK_COFFEE")
public class ReadyToDrinkCoffee extends CoffeeProduct {
	@ElementCollection(targetClass = IceLevel.class)
	@CollectionTable(name = "ready_to_drink_coffee_ice_levels", joinColumns = @JoinColumn(name = "coffee_id"))
	@Column(name = "ice_level")
	@Enumerated(EnumType.STRING)
	private Set<IceLevel> iceLevels = new HashSet<>();

	@ElementCollection(targetClass = SugarLevel.class)
	@CollectionTable(name = "ready_to_drink_coffee_sugar_levels", joinColumns = @JoinColumn(name = "coffee_id"))
	@Column(name = "sugar_level")
	@Enumerated(EnumType.STRING)
	private Set<SugarLevel> sugarLevels = new HashSet<>();

	@ElementCollection(targetClass = SizeOption.class)
	@CollectionTable(name = "ready_to_drink_coffee_size_options", joinColumns = @JoinColumn(name = "coffee_id"))
	@Column(name = "size_option")
	@Enumerated(EnumType.STRING)
	private Set<SizeOption> sizeOptions = new HashSet<>();

	public enum IceLevel {
		NO_ICE, LESS_ICE, NORMAL_ICE
	}

	public enum SugarLevel {
		NO_SUGAR, LESS_SUGAR, NORMAL_SUGAR
	}

	public enum SizeOption {
		SMALL, MEDIUM, LARGE
	}

	public ReadyToDrinkCoffee() {
		super();
		this.iceLevels.addAll(Arrays.asList(IceLevel.values()));
		this.sugarLevels.addAll(Arrays.asList(SugarLevel.values()));
		this.sizeOptions.addAll(Arrays.asList(SizeOption.values()));
	}

	public ReadyToDrinkCoffee(String name, String description, Double price, String imageUrl, LocalDateTime create_at,
			LocalDateTime update_at, Set<IceLevel> iceLevels, Set<SugarLevel> sugarLevels,
			Set<SizeOption> sizeOptions) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.iceLevels = iceLevels != null && !iceLevels.isEmpty() ? new HashSet<>(iceLevels)
				: new HashSet<>(Arrays.asList(IceLevel.values()));
		this.sugarLevels = sugarLevels != null && !sugarLevels.isEmpty() ? new HashSet<>(sugarLevels)
				: new HashSet<>(Arrays.asList(SugarLevel.values()));
		this.sizeOptions = sizeOptions != null && !sizeOptions.isEmpty() ? new HashSet<>(sizeOptions)
				: new HashSet<>(Arrays.asList(SizeOption.values()));
	}

	public Set<IceLevel> getIceLevels() {
		return iceLevels;
	}

	public void setIceLevels(Set<IceLevel> iceLevels) {
		this.iceLevels = iceLevels != null && !iceLevels.isEmpty() ? new HashSet<>(iceLevels)
				: new HashSet<>(Arrays.asList(IceLevel.values()));
	}

	public Set<SugarLevel> getSugarLevels() {
		return sugarLevels;
	}

	public void setSugarLevels(Set<SugarLevel> sugarLevels) {
		this.sugarLevels = sugarLevels != null && !sugarLevels.isEmpty() ? new HashSet<>(sugarLevels)
				: new HashSet<>(Arrays.asList(SugarLevel.values()));
	}

	public Set<SizeOption> getSizeOptions() {
		return sizeOptions;
	}

	public void setSizeOptions(Set<SizeOption> sizeOptions) {
		this.sizeOptions = sizeOptions != null && !sizeOptions.isEmpty() ? new HashSet<>(sizeOptions)
				: new HashSet<>(Arrays.asList(SizeOption.values()));
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		super.updateFromDTO(productDTO);
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getIceLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getIceLevels().isEmpty()) {
			try {
				this.setIceLevels(productDTO.getSpecificAttributesDTO().getIceLevels().stream().map(IceLevel::valueOf)
						.collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setIceLevels(new HashSet<>(Arrays.asList(IceLevel.values())));
			}
		}
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getSugarLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getSugarLevels().isEmpty()) {
			try {
				this.setSugarLevels(productDTO.getSpecificAttributesDTO().getSugarLevels().stream()
						.map(SugarLevel::valueOf).collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setSugarLevels(new HashSet<>(Arrays.asList(SugarLevel.values())));
			}
		}
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getSizeOptions() != null
				&& !productDTO.getSpecificAttributesDTO().getSizeOptions().isEmpty()) {
			try {
				this.setSizeOptions(productDTO.getSpecificAttributesDTO().getSizeOptions().stream()
						.map(SizeOption::valueOf).collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setSizeOptions(new HashSet<>(Arrays.asList(SizeOption.values())));
			}
		}
	}

	@Override
	public double calculatePrice(String sizeOption) {
		double basePrice = getPrice();
		if (sizeOption == null || sizeOption.isEmpty()) {
			return basePrice;
		}
		double additionalPrice = switch (sizeOption) {
		case "MEDIUM" -> 10000;
		case "LARGE" -> 20000;
		default -> 0;
		};
		return basePrice + additionalPrice;
	}

	public List<Map<String, Object>> getOptionsWithPrices() {
		List<Map<String, Object>> options = new ArrayList<>();

		for (IceLevel ice : iceLevels) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "IceLevel");
			option.put("value", ice.name());
			option.put("additionalPrice", 0.0);

			options.add(option);
		}

		for (SugarLevel sugar : sugarLevels) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "SugarLevel");
			option.put("value", sugar.name());
			option.put("additionalPrice", 0.0);
			options.add(option);
		}

		for (SizeOption size : sizeOptions) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "SizeOption");
			option.put("value", size.name());
			double basePrice = getPrice();
			double adjustedPrice = calculatePrice(size.name());
			option.put("additionalPrice", adjustedPrice - basePrice);
			options.add(option);
		}

		return options;
	}
}