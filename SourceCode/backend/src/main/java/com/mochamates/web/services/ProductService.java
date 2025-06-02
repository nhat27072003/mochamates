package com.mochamates.web.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.mochamates.web.dto.product.GetProductsResponseDTO;
import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.OptionDTO;
import com.mochamates.web.dto.product.OptionValueDTO;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.dto.product.ProductResponseDTO;
import com.mochamates.web.dto.product.SpecificAttributesDTO;
import com.mochamates.web.dto.statistics.TopProductDTO;
import com.mochamates.web.entities.products.CoffeeFactory;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.InstantCoffee;
import com.mochamates.web.entities.products.InstantCoffeeFactory;
import com.mochamates.web.entities.products.Option;
import com.mochamates.web.entities.products.OptionType;
import com.mochamates.web.entities.products.OptionValue;
import com.mochamates.web.entities.products.ProductOption;
import com.mochamates.web.entities.products.ReadyToDrinkCoffee;
import com.mochamates.web.entities.products.ReadyToDrinkCoffeeFactory;
import com.mochamates.web.entities.products.RoastCoffeeFactory;
import com.mochamates.web.entities.products.RoastedCoffee;
import com.mochamates.web.exception.InvalidProductInfoException;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.repository.OptionRepository;
import com.mochamates.web.repository.OptionValueRepository;
import com.mochamates.web.repository.ProductOptionRepository;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.repository.ReviewRepository;
import com.mochamates.web.validators.ProductValidator;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
	private ProductRepository productRepository;
	private ProductValidator productValidator;
	private OptionRepository optionRepository;
	private OptionValueRepository optionValueRepository;
	private ProductOptionRepository productOptionRepository;
	private ReviewRepository reviewRepository;

	public ProductService(ProductRepository productRepository, OptionRepository optionRepository,
			OptionValueRepository optionValueRepository, ProductOptionRepository productOptionRepository,
			ReviewRepository reviewRepository) {
		this.productRepository = productRepository;
		this.optionRepository = optionRepository;
		this.optionValueRepository = optionValueRepository;
		this.productOptionRepository = productOptionRepository;
		this.reviewRepository = reviewRepository;
	}

	public GetProductsResponseForAdmin getProductsForAdmin(int page, int size) {
		if (page < 0 || size <= 0) {
			throw new InvalidProductInfoException("Page index must be >= 0 and size > 0.");
		}
		GetProductsResponseForAdmin response = new GetProductsResponseForAdmin();

		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage = productRepository.findAll(pageable);

			List<ProductDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			throw new InvalidProductInfoException("Failed to retrieve products: " + e.getMessage());
		}

		return response;
	}

	public ProductResponseDTO getProductById(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());
		return mapToProductResponseDTO(product);
	}

	public List<TopProductDTO> getTopSellingProducts(LocalDateTime startDate, LocalDateTime endDate, int limit) {
		List<Object[]> results = productRepository.findTopSellingProducts(startDate, endDate, limit);
		return results.stream().map(row -> {
			TopProductDTO dto = new TopProductDTO();
			dto.setProductId((Long) row[0]);
			dto.setProductName((String) row[1]);
			dto.setTotalSold((Long) row[2]);
			dto.setTotalRevenue((Double) row[3]);
			Double avgRating = reviewRepository.findAverageRatingByProductId(dto.getProductId());
			dto.setAverageRating(avgRating != null ? avgRating : 0.0);
			return dto;
		}).collect(Collectors.toList());
	}

	private ProductResponseDTO mapToProductResponseDTO(CoffeeProduct product) {
		ProductResponseDTO dto = new ProductResponseDTO();
		dto.setId(product.getId());
		dto.setName(product.getName());
		dto.setDescription(product.getDescription());
		dto.setPrice(product.getPrice());
		dto.setImageUrl(product.getImageUrl());
		dto.setUpdateAt(product.getUpdateAt());
		dto.setType(product instanceof InstantCoffee ? "INSTANT_COFFEE"
				: product instanceof ReadyToDrinkCoffee ? "READY_TO_DRINK_COFFEE"
						: product instanceof RoastedCoffee ? "ROASTED_COFFEE" : null);

		SpecificAttributesDTO specificAttributesDTO = new SpecificAttributesDTO();
		List<OptionDTO> optionDTOs = new ArrayList<>();

		if (product instanceof ReadyToDrinkCoffee coffee) {
			optionDTOs.addAll(convertOptionsWithPricesToDTOs(coffee.getOptionsWithPrices()));
		} else if (product instanceof RoastedCoffee coffee) {
			optionDTOs.addAll(convertOptionsWithPricesToDTOs(coffee.getOptionsWithPrices()));
			specificAttributesDTO.setOrigin(coffee.getOrigin());
			specificAttributesDTO.setComposition(coffee.getComposition());
			specificAttributesDTO.setRoastDate(coffee.getRoastDate());
		} else if (product instanceof InstantCoffee coffee) {
			List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(product.getId());
			optionDTOs.addAll(productOptions.stream().map(ProductOption::getOption).map(this::mapToOptionResponseDTO)
					.collect(Collectors.toList()));
			specificAttributesDTO.setPackType(coffee.getPackType());
			specificAttributesDTO.setInstructions(coffee.getInstructions());
			specificAttributesDTO.setExpireDate(coffee.getExpireDate());
		}

		dto.setSpecificAttributesDTO(specificAttributesDTO);
		dto.setOptions(optionDTOs);
		return dto;
	}

	private List<OptionDTO> convertOptionsWithPricesToDTOs(List<Map<String, Object>> optionsWithPrices) {
		Map<String, List<Map<String, Object>>> groupedByType = optionsWithPrices.stream()
				.collect(Collectors.groupingBy(option -> (String) option.get("type")));

		List<OptionDTO> optionDTOs = new ArrayList<>();
		for (Map.Entry<String, List<Map<String, Object>>> entry : groupedByType.entrySet()) {
			OptionDTO optionDTO = new OptionDTO();
			optionDTO.setName(entry.getKey());
			List<OptionValueDTO> valueDTOs = new ArrayList<>();

			for (Map<String, Object> option : entry.getValue()) {
				OptionValueDTO valueDTO = new OptionValueDTO();
				valueDTO.setValue((String) option.get("value"));
				valueDTO.setAdditionalPrice(((Number) option.get("additionalPrice")).doubleValue());
				valueDTOs.add(valueDTO);
			}

			optionDTO.setValues(valueDTOs);
			optionDTOs.add(optionDTO);
		}

		return optionDTOs;
	}

	private OptionDTO mapToOptionResponseDTO(Option option) {
		OptionDTO dto = new OptionDTO();
		dto.setName(option.getName());
		List<OptionValueDTO> valueDTOs = option.getValues().stream().map(value -> {
			OptionValueDTO valueDTO = new OptionValueDTO();
			valueDTO.setValue(value.getValue());
			valueDTO.setAdditionalPrice(value.getAdditionalPrice());
			return valueDTO;
		}).collect(Collectors.toList());
		dto.setValues(valueDTOs);
		return dto;
	}

	public CoffeeProduct createProduct(ProductDTO product) {
		CoffeeFactory coffeeFactory;
		productValidator = new ProductValidator(product);
		if (!productValidator.validateProduct()) {
			throw new InvalidProductInfoException();
		}
		if (product.getType().equals("INSTANT_COFFEE")) {
			coffeeFactory = new InstantCoffeeFactory();
		} else if (product.getType().equals("READY_TO_DRINK_COFFEE")) {
			coffeeFactory = new ReadyToDrinkCoffeeFactory();
		} else if (product.getType().equals("ROASTED_COFFEE")) {
			coffeeFactory = new RoastCoffeeFactory();
		} else {
			throw new InvalidProductInfoException("Invalid product type: " + product.getType());
		}

		CoffeeProduct coffee = coffeeFactory.createCoffee(product);
		coffee.setCreateAt(LocalDateTime.now());
		coffee.setUpdateAt(LocalDateTime.now());
		productRepository.save(coffee);

		if (product.getOptions() != null) {
			processOptions(coffee, product.getOptions());
		}
		return coffee;
	}

	public ProductResponseDTO updateProduct(Long id, ProductDTO productDTO) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());
		productValidator = new ProductValidator(productDTO);
		if (!productValidator.validateProduct()) {
			throw new InvalidProductInfoException();
		}
		product.setName(productDTO.getName());
		product.setDescription(productDTO.getDescription());
		product.setPrice(productDTO.getPrice());
		product.setUpdateAt(LocalDateTime.now());
		product.setImageUrl(productDTO.getImageUrl());

		product.updateFromDTO(productDTO);
//		if (productDTO.getOptions() != null) {
//			processOptions(product, productDTO.getOptions());
//		}
		productRepository.save(product);
		return mapToProductResponseDTO(product);
	}

	@Transactional
	public CoffeeProduct deleteProduct(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());

//		List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(id);
//
//		for (ProductOption productOption : productOptions) {
//			Long optionId = productOption.getOption().getId();
//			productOptionRepository.delete(productOption);
//			boolean stillUsed = productOptionRepository.existsByOptionId(optionId);
//			if (!stillUsed) {
//				optionRepository.findById(optionId).ifPresent(optionRepository::delete);
//			}
//		}

		productRepository.deleteById(id);
		return product;
	}

	@Transactional
	private void processOptions(CoffeeProduct product, List<OptionDTO> optionDTOs) {
		List<ProductOption> existingProductOptions = productOptionRepository.findByCoffeeProductId(product.getId());
		java.util.Map<Long, String> optionIdToName = existingProductOptions.stream().collect(Collectors
				.toMap(po -> po.getOption().getId(), po -> po.getOption().getName(), (name1, name2) -> name1));

		for (OptionDTO optionDTO : optionDTOs) {
			String newName = optionDTO.getName();
			Long currentOptionId = optionDTO.getId();
			boolean nameExists = optionIdToName.entrySet().stream()
					.anyMatch(entry -> entry.getValue().equals(newName) && !entry.getKey().equals(currentOptionId));
			if (nameExists) {
				throw new InvalidProductInfoException(
						"Option with name '" + newName + "' is already linked to this product");
			}

			final Option option;
			if (optionDTO.getId() != null) {
				Option existingOption = optionRepository.findById(optionDTO.getId())
						.orElseThrow(() -> new InvalidProductInfoException("Option not found: " + optionDTO.getId()));
				existingOption.setName(optionDTO.getName());
				existingOption.setType(OptionType.valueOf(optionDTO.getType()));
				existingOption.getValues().clear();
				option = optionRepository.save(existingOption);

				for (OptionValueDTO valueDTO : optionDTO.getValues()) {
					OptionValue optionValue = new OptionValue();
					optionValue.setOption(option);
					optionValue.setValue(valueDTO.getValue());
					optionValue.setAdditionalPrice(valueDTO.getAdditionalPrice());
					option.getValues().add(optionValue);
					optionValueRepository.save(optionValue);
				}
			} else {
				if (optionDTO.getName() == null || optionDTO.getType() == null || optionDTO.getValues() == null) {
					throw new InvalidProductInfoException("New option must have name, type, and values");
				}

				Option newOption = new Option();
				newOption.setName(optionDTO.getName());
				newOption.setType(OptionType.valueOf(optionDTO.getType()));
				option = optionRepository.save(newOption);

				for (OptionValueDTO valueDTO : optionDTO.getValues()) {
					OptionValue optionValue = new OptionValue();
					optionValue.setOption(option);
					optionValue.setValue(valueDTO.getValue());
					optionValue.setAdditionalPrice(valueDTO.getAdditionalPrice());
					option.getValues().add(optionValue);
					optionValueRepository.save(optionValue);
				}
			}

			ProductOption productOption = existingProductOptions.stream()
					.filter(po -> po.getOption().getId().equals(option.getId())).findFirst().orElseGet(() -> {
						ProductOption newPo = new ProductOption();
						newPo.setCoffeeProduct(product);
						newPo.setOption(option);
						return newPo;
					});
			productOption.setRequired(optionDTO.isRequired());
			productOptionRepository.save(productOption);

			optionIdToName.put(option.getId(), option.getName());
		}
	}

	private ProductDTO mapToDTO(CoffeeProduct product) {
		ProductDTO dto = new ProductDTO();
		dto.setId(product.getId());
		dto.setName(product.getName());
		dto.setDescription(product.getDescription());
		dto.setPrice(product.getPrice());
		dto.setImageUrl(product.getImageUrl());
		dto.setType(product instanceof RoastedCoffee ? "ROASTED_COFFEE"
				: product instanceof InstantCoffee ? "INSTANT_COFFEE"
						: product instanceof ReadyToDrinkCoffee ? "READY_TO_DRINK_COFFEE" : null);

		SpecificAttributesDTO specificAttributesDTO = new SpecificAttributesDTO();
		if (product instanceof ReadyToDrinkCoffee coffee) {
			specificAttributesDTO
					.setIceLevels(coffee.getIceLevels().stream().map(Enum::name).collect(Collectors.toSet()));
			specificAttributesDTO
					.setSugarLevels(coffee.getSugarLevels().stream().map(Enum::name).collect(Collectors.toSet()));
			specificAttributesDTO
					.setSizeOptions(coffee.getSizeOptions().stream().map(Enum::name).collect(Collectors.toSet()));
		} else if (product instanceof RoastedCoffee coffee) {
			specificAttributesDTO
					.setRoastLevels(coffee.getRoastLevels().stream().map(Enum::name).collect(Collectors.toSet()));
			specificAttributesDTO.setOrigin(coffee.getOrigin());
			specificAttributesDTO.setRoastDate(coffee.getRoastDate());
			specificAttributesDTO.setComposition(coffee.getComposition());
			specificAttributesDTO
					.setGrindLevels(coffee.getGrindLevels().stream().map(Enum::name).collect(Collectors.toSet()));
			specificAttributesDTO.setWeights(coffee.getWeights().stream().map(Enum::name).collect(Collectors.toSet()));
		} else if (product instanceof InstantCoffee coffee) {
			specificAttributesDTO.setPackType(coffee.getPackType());
			specificAttributesDTO.setInstructions(coffee.getInstructions());
			specificAttributesDTO.setExpireDate(coffee.getExpireDate());
		}
		dto.setSpecificAttributesDTO(specificAttributesDTO);

		List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(product.getId());
		dto.setOptions(productOptions.stream().map(ProductOption::getOption).map(this::mapToOptionResponseDTO)
				.collect(Collectors.toList()));

		return dto;
	}

	public GetProductsResponseDTO getNewestProducts(int page, int size) {
		if (page < 0 || size <= 0) {
			throw new InvalidProductInfoException("Page index must be >= 0 and size > 0.");
		}
		GetProductsResponseDTO response = new GetProductsResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createAt"));
			Page<CoffeeProduct> coffeePage = productRepository.findAll(pageable);
			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			throw new InvalidProductInfoException("Failed to retrieve newest products: " + e.getMessage());
		}
		return response;
	}

	public GetProductsResponseDTO getProductsByType(String type, int page, int size) {
		if (page < 0 || size <= 0) {
			throw new InvalidProductInfoException("Page index must be >= 0 and size > 0.");
		}
		// Updated to support INSTANT_COFFEE
		if (!List.of("ROASTED_COFFEE", "INSTANT_COFFEE", "READY_TO_DRINK_COFFEE").contains(type)) {
			throw new InvalidProductInfoException("Invalid product type: " + type);
		}

		GetProductsResponseDTO response = new GetProductsResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage;

			switch (type) {
			case "ROASTED_COFFEE":
				coffeePage = productRepository.findByType("ROASTED_COFFEE", pageable);
				break;
			case "INSTANT_COFFEE":
				coffeePage = productRepository.findByType("INSTANT_COFFEE", pageable);
				break;
			case "READY_TO_DRINK_COFFEE":
				coffeePage = productRepository.findByType("READY_TO_DRINK_COFFEE", pageable);
				break;
			default:
				throw new InvalidProductInfoException("Unexpected product type: " + type);
			}

			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			System.out.println(e);
			throw new InvalidProductInfoException("Failed to retrieve products by type: " + e.getMessage());
		}
		return response;
	}

	public GetProductsResponseDTO getProducts(String type, int page, int size) {
		if (page < 0 || size <= 0) {
			throw new InvalidProductInfoException("Page index must be >= 0 and size > 0.");
		}
		if (type != null && !List.of("ROASTED_COFFEE", "PACKAGED_COFFEE", "READY_TO_DRINK_COFFEE").contains(type)) {
			throw new InvalidProductInfoException("Invalid product type: " + type);
		}
		GetProductsResponseDTO response = new GetProductsResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage;
			if (type == null) {
				coffeePage = productRepository.findAll(pageable);
			} else if (type.equals("ROASTED_COFFEE")) {
				coffeePage = productRepository.findByType("ROASTED_COFFEE", pageable);
			} else if (type.equals("INSTANT_COFFEE")) {
				coffeePage = productRepository.findByType("INSTANT_COFFEE", pageable);
			} else {
				coffeePage = productRepository.findByType("READY_TO_DRINK_COFFEE", pageable);
			}

			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			throw new InvalidProductInfoException("Failed to retrieve products: " + e.getMessage());
		}
		return response;
	}

	public List<Option> getOptions() {
		return optionRepository.findAll();
	}
}