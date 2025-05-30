package com.mochamates.web.entities.products;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.mochamates.web.dto.product.ProductDTO;

public class RoastCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		// Khởi tạo các Set với giá trị mặc định
		Set<RoastedCoffee.RoastLevel> roastLevels = new HashSet<>(Arrays.asList(RoastedCoffee.RoastLevel.values()));
		Set<RoastedCoffee.GrindLevel> grindLevels = new HashSet<>(Arrays.asList(RoastedCoffee.GrindLevel.values()));
		Set<RoastedCoffee.Weight> weights = new HashSet<>(Arrays.asList(RoastedCoffee.Weight.values()));

		// Xử lý roastLevels từ DTO
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getRoastLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getRoastLevels().isEmpty()) {
			try {
				roastLevels = productDTO.getSpecificAttributesDTO().getRoastLevels().stream()
						.map(RoastedCoffee.RoastLevel::valueOf).collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				roastLevels = new HashSet<>(Arrays.asList(RoastedCoffee.RoastLevel.values()));
			}
		}

		// Xử lý grindLevels từ DTO
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getGrindLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getGrindLevels().isEmpty()) {
			try {
				grindLevels = productDTO.getSpecificAttributesDTO().getGrindLevels().stream()
						.map(RoastedCoffee.GrindLevel::valueOf).collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				grindLevels = new HashSet<>(Arrays.asList(RoastedCoffee.GrindLevel.values()));
			}
		}

		// Xử lý weights từ DTO
		if (productDTO.getSpecificAttributesDTO() != null && productDTO.getSpecificAttributesDTO().getWeights() != null
				&& !productDTO.getSpecificAttributesDTO().getWeights().isEmpty()) {
			try {
				weights = productDTO.getSpecificAttributesDTO().getWeights().stream().map(RoastedCoffee.Weight::valueOf)
						.collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				weights = new HashSet<>(Arrays.asList(RoastedCoffee.Weight.values()));
			}
		}

		return new RoastedCoffee(productDTO.getName(), productDTO.getDescription(), productDTO.getPrice(),
				productDTO.getImageUrl(), LocalDateTime.now(), LocalDateTime.now(),
				productDTO.getSpecificAttributesDTO() != null ? productDTO.getSpecificAttributesDTO().getOrigin()
						: null,
				roastLevels,
				productDTO.getSpecificAttributesDTO() != null ? productDTO.getSpecificAttributesDTO().getRoastDate()
						: null,
				productDTO.getSpecificAttributesDTO() != null ? productDTO.getSpecificAttributesDTO().getComposition()
						: null,
				grindLevels, weights);
	}
}