package com.mochamates.web.entities.products;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.mochamates.web.dto.product.ProductDTO;

public class ReadyToDrinkCoffeeFactory implements CoffeeFactory {

	@Override
	public CoffeeProduct createCoffee(ProductDTO productDTO) {
		// Khởi tạo các Set với giá trị mặc định
		Set<ReadyToDrinkCoffee.IceLevel> iceLevels = new HashSet<>(Arrays.asList(ReadyToDrinkCoffee.IceLevel.values()));
		Set<ReadyToDrinkCoffee.SugarLevel> sugarLevels = new HashSet<>(
				Arrays.asList(ReadyToDrinkCoffee.SugarLevel.values()));
		Set<ReadyToDrinkCoffee.SizeOption> sizeOptions = new HashSet<>(
				Arrays.asList(ReadyToDrinkCoffee.SizeOption.values()));

		// Xử lý iceLevels từ DTO
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getIceLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getIceLevels().isEmpty()) {
			try {
				iceLevels = productDTO.getSpecificAttributesDTO().getIceLevels().stream()
						.map(ReadyToDrinkCoffee.IceLevel::valueOf).collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				iceLevels = new HashSet<>(Arrays.asList(ReadyToDrinkCoffee.IceLevel.values()));
			}
		}

		// Xử lý sugarLevels từ DTO
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getSugarLevels() != null
				&& !productDTO.getSpecificAttributesDTO().getSugarLevels().isEmpty()) {
			try {
				sugarLevels = productDTO.getSpecificAttributesDTO().getSugarLevels().stream()
						.map(ReadyToDrinkCoffee.SugarLevel::valueOf).collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				sugarLevels = new HashSet<>(Arrays.asList(ReadyToDrinkCoffee.SugarLevel.values()));
			}
		}

		// Xử lý sizeOptions từ DTO
		if (productDTO.getSpecificAttributesDTO() != null
				&& productDTO.getSpecificAttributesDTO().getSizeOptions() != null
				&& !productDTO.getSpecificAttributesDTO().getSizeOptions().isEmpty()) {
			try {
				sizeOptions = productDTO.getSpecificAttributesDTO().getSizeOptions().stream()
						.map(ReadyToDrinkCoffee.SizeOption::valueOf).collect(Collectors.toSet());
			} catch (IllegalArgumentException e) {
				// Giữ giá trị mặc định nếu có lỗi
				sizeOptions = new HashSet<>(Arrays.asList(ReadyToDrinkCoffee.SizeOption.values()));
			}
		}

		return new ReadyToDrinkCoffee(productDTO.getName(), productDTO.getDescription(), productDTO.getPrice(),
				productDTO.getImageUrl(), LocalDateTime.now(), LocalDateTime.now(), iceLevels, sugarLevels,
				sizeOptions);
	}
}