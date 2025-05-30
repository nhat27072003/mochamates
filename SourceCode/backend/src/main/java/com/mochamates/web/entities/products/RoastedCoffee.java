package com.mochamates.web.entities.products;

import java.time.LocalDate;
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
@DiscriminatorValue("ROASTED_COFFEE")
public class RoastedCoffee extends CoffeeProduct {
	private String origin;
	@ElementCollection(targetClass = RoastLevel.class)
	@CollectionTable(name = "roasted_coffee_roast_levels", joinColumns = @JoinColumn(name = "roasted_coffee_id"))
	@Column(name = "roast_level")
	@Enumerated(EnumType.STRING)
	private Set<RoastLevel> roastLevels = new HashSet<>();
	private LocalDate roastDate;
	private String composition;
	@ElementCollection(targetClass = GrindLevel.class)
	@CollectionTable(name = "roasted_coffee_grind_levels", joinColumns = @JoinColumn(name = "roasted_coffee_id"))
	@Column(name = "grind_level")
	@Enumerated(EnumType.STRING)
	private Set<GrindLevel> grindLevels = new HashSet<>();
	@ElementCollection(targetClass = Weight.class)
	@CollectionTable(name = "roasted_coffee_weights", joinColumns = @JoinColumn(name = "roasted_coffee_id"))
	@Column(name = "weight")
	@Enumerated(EnumType.STRING)
	private Set<Weight> weights = new HashSet<>();

	public enum RoastLevel {
		LIGHT, MEDIUM, DARK
	}

	public enum GrindLevel {
		WHOLE_BEAN, FINE, MEDIUM, COARSE
	}

	public enum Weight {
		G250, G500, KG1
	}

	public RoastedCoffee() {
		super();
		// Tự động thêm tất cả giá trị của RoastLevel, GrindLevel và Weight
		this.roastLevels.addAll(Arrays.asList(RoastLevel.values()));
		this.grindLevels.addAll(Arrays.asList(GrindLevel.values()));
		this.weights.addAll(Arrays.asList(Weight.values()));
	}

	public RoastedCoffee(String name, String description, Double price, String imageUrl, LocalDateTime create_at,
			LocalDateTime update_at, String origin, Set<RoastLevel> roastLevels, LocalDate roastDate,
			String composition, Set<GrindLevel> grindLevels, Set<Weight> weights) {
		super(name, description, price, imageUrl, create_at, update_at);
		this.origin = origin;
		this.roastLevels = roastLevels != null && !roastLevels.isEmpty() ? new HashSet<>(roastLevels)
				: new HashSet<>(Arrays.asList(RoastLevel.values()));
		this.roastDate = roastDate;
		this.composition = composition;
		this.grindLevels = grindLevels != null && !grindLevels.isEmpty() ? new HashSet<>(grindLevels)
				: new HashSet<>(Arrays.asList(GrindLevel.values()));
		this.weights = weights != null && !weights.isEmpty() ? new HashSet<>(weights)
				: new HashSet<>(Arrays.asList(Weight.values()));
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public Set<RoastLevel> getRoastLevels() {
		return roastLevels;
	}

	public void setRoastLevels(Set<RoastLevel> roastLevels) {
		this.roastLevels = roastLevels != null && !roastLevels.isEmpty() ? new HashSet<>(roastLevels)
				: new HashSet<>(Arrays.asList(RoastLevel.values()));
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

	public Set<GrindLevel> getGrindLevels() {
		return grindLevels;
	}

	public void setGrindLevels(Set<GrindLevel> grindLevels) {
		this.grindLevels = grindLevels != null && !grindLevels.isEmpty() ? new HashSet<>(grindLevels)
				: new HashSet<>(Arrays.asList(GrindLevel.values()));
	}

	public Set<Weight> getWeights() {
		return weights;
	}

	public void setWeights(Set<Weight> weights) {
		this.weights = weights != null && !weights.isEmpty() ? new HashSet<>(weights)
				: new HashSet<>(Arrays.asList(Weight.values()));
	}

	@Override
	public void updateFromDTO(ProductDTO productDTO) {
		super.updateFromDTO(productDTO);
		this.setOrigin(productDTO.getSpecificAttributesDTO().getOrigin());
		// Cập nhật roastLevels
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getRoastLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getRoastLevels().isEmpty()) {
			try {
				this.setRoastLevels(productDTO.getSpecificAttributesDTO().getRoastLevels().stream()
						.map(RoastLevel::valueOf).collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setRoastLevels(new HashSet<>(Arrays.asList(RoastLevel.values())));
			}
		}
		this.setRoastDate(productDTO.getSpecificAttributesDTO().getRoastDate());
		this.setComposition(productDTO.getSpecificAttributesDTO().getComposition());
		// Cập nhật grindLevels
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getGrindLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getGrindLevels().isEmpty()) {
			try {
				this.setGrindLevels(productDTO.getSpecificAttributesDTO().getGrindLevels().stream()
						.map(GrindLevel::valueOf).collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setGrindLevels(new HashSet<>(Arrays.asList(GrindLevel.values())));
			}
		}
		// Cập nhật weights
		if (productDTO.getSpecificAttributesDTO() != null && productDTO.getSpecificAttributesDTO().getWeights() != null
				&& !productDTO.getSpecificAttributesDTO().getWeights().isEmpty()) {
			try {
				this.setWeights(productDTO.getSpecificAttributesDTO().getWeights().stream().map(Weight::valueOf)
						.collect(Collectors.toSet()));
			} catch (IllegalArgumentException e) {
				this.setWeights(new HashSet<>(Arrays.asList(Weight.values())));
			}
		}
	}

	@Override
	public double calculatePrice(String weight) {
		double basePrice = getPrice();
		if (weight == null || weight.isEmpty()) {
			return basePrice;
		}
		double multiplier = switch (weight) {
		case "G500" -> 0.5;
		case "G250" -> 0.25;
		default -> 1.0;
		};
		return basePrice * multiplier;
	}

	public List<Map<String, Object>> getOptionsWithPrices() {
		List<Map<String, Object>> options = new ArrayList<>();

		// Add roast levels
		for (RoastLevel roast : roastLevels) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "RoastLevel");
			option.put("value", roast.name());
			option.put("additionalPrice", 0.0);
			options.add(option);
		}

		// Add grind levels
		for (GrindLevel grind : grindLevels) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "GrindLevel");
			option.put("value", grind.name());
			option.put("additionalPrice", 0.0);
			options.add(option);
		}

		// Add weights
		for (Weight weight : weights) {
			Map<String, Object> option = new HashMap<>();
			option.put("type", "Weight");
			option.put("value", weight.name());
			double basePrice = getPrice();
			double adjustedPrice = calculatePrice(weight.name());
			option.put("additionalPrice", adjustedPrice - basePrice);
			options.add(option);
		}

		return options;
	}
}