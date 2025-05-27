package com.mochamates.web.services;

import java.time.LocalDateTime;
import java.util.List;
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
import com.mochamates.web.entities.products.CoffeeFactory;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.GroundCoffee;
import com.mochamates.web.entities.products.GroundFactory;
import com.mochamates.web.entities.products.Option;
import com.mochamates.web.entities.products.OptionType;
import com.mochamates.web.entities.products.OptionValue;
import com.mochamates.web.entities.products.PackagedCoffee;
import com.mochamates.web.entities.products.PackagedCoffeeFactory;
import com.mochamates.web.entities.products.ProductOption;
import com.mochamates.web.entities.products.ReadyToDrinkCoffee;
import com.mochamates.web.entities.products.ReadyToDrinkCoffeeFactory;
import com.mochamates.web.exception.InvalidProductInfoException;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.repository.OptionRepository;
import com.mochamates.web.repository.OptionValueRepository;
import com.mochamates.web.repository.ProductOptionRepository;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.validators.ProductValidator;

import jakarta.transaction.Transactional;

/**
 * Service class that handles business logic related to CoffeeProduct operation
 * includeing listing, creating, updating, and deleting products.
 */
@Service
public class ProductService {
	private ProductRepository productRepository;
	private List<CoffeeProduct> listProducts;
	private ProductValidator productValidator;
	private OptionRepository optionRepository;
	private OptionValueRepository optionValueRepository;
	private ProductOptionRepository productOptionRepository;

	public ProductService(ProductRepository productRepository, OptionRepository optionRepository,
			OptionValueRepository optionValueRepository, ProductOptionRepository productOptionRepository) {
		this.productRepository = productRepository;
		this.optionRepository = optionRepository;
		this.optionValueRepository = optionValueRepository;
		this.productOptionRepository = productOptionRepository;
	}

	/**
	 * Retrieves a paginated list of products for admin view.
	 * 
	 * @param page
	 * @param size
	 * @return a GetProductsResponseForAdmin object containing the paginated
	 *         products
	 * @throws InvalidProductInfoException if page or size is invalid
	 */
	public GetProductsResponseForAdmin getProductsForAdmin(int page, int size) {
		if (page < 0 || size <= 0) {
			throw new IllegalArgumentException("Page index must be >= 0 and size > 0.");
		}
		GetProductsResponseForAdmin response = new GetProductsResponseForAdmin();

		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage = productRepository.findAll(pageable);

			// Ánh xạ CoffeeProduct sang ProductDTO
			List<ProductDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Invalid pagination parameters");
		} catch (Exception e) {
			throw new IllegalArgumentException("Failed to retrieve products: " + e.getMessage());
		}

		return response;
	}

	/**
	 * Retrieves a CoffeeProduct by its ID.
	 * 
	 * @param id
	 * @return the CoffeeProduct if found
	 * @throws InvalidProductInfoException if the product with the given ID does not
	 *                                     exist
	 */
//	public CoffeeProduct getProductById(Long id) {
//		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());
//
//		return product;
//	}

//	public List<CoffeeProduct> searchProducts() {
//		List<CoffeeProduct> listProduct = new ArrayList<CoffeeProduct>();
//
//		return listProducts;
//	}

//	public boolean checkStockAvailability(Long id) {
//		Optional<CoffeeProduct> productOptional = productRepository.findById(id);
//
//		if (!productOptional.isPresent()) {
//			return false;
//		}
//		CoffeeProduct product = productOptional.get();
//
//		return true;
//	}
	public ProductResponseDTO getProductById(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());
		return mapToProductResponseDTO(product);
	}

	private ProductResponseDTO mapToProductResponseDTO(CoffeeProduct product) {
		ProductResponseDTO dto = new ProductResponseDTO();
		dto.setId(product.getId());
		dto.setName(product.getName());
		dto.setDescription(product.getDescription());
		dto.setPrice(product.getPrice());
		dto.setImageUrl(product.getImageUrl());
		dto.setUpdateAt(product.getUpdateAt());
		dto.setType(product instanceof PackagedCoffee ? "PACKAGED_COFFEE"
				: product instanceof ReadyToDrinkCoffee ? "READY_TO_DRINK_COFFEE" : "GROUND_COFFEE");

		SpecificAttributesDTO specificAttributesDTO = new SpecificAttributesDTO();
		if (product instanceof ReadyToDrinkCoffee coffee) {
			specificAttributesDTO.setDrinkType(coffee.getDrinkType());
			specificAttributesDTO.setPreparationTime(coffee.getPreparationTime());
			specificAttributesDTO.setIngredients(coffee.getIngredients());
		} else if (product instanceof GroundCoffee coffee) {
			specificAttributesDTO.setOrigin(coffee.getOrigin());
			specificAttributesDTO.setRoastDate(coffee.getRoastDate());
			specificAttributesDTO.setRoastLevel(coffee.getRoastLevel());
		} else if (product instanceof PackagedCoffee coffee) {
			specificAttributesDTO.setPackType(coffee.getPackType());
			specificAttributesDTO.setInstructions(coffee.getInstructions());
			specificAttributesDTO.setExpireDate(coffee.getExpireDate());
		}
		dto.setSpecificAttributesDTO(specificAttributesDTO);

		// Options
		List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(product.getId());
		dto.setOptions(productOptions.stream().map(ProductOption::getOption).map(this::mapToOptionResponseDTO)
				.collect(Collectors.toList()));

		return dto;
	}

	private OptionDTO mapToOptionResponseDTO(Option option) {
		OptionDTO dto = new OptionDTO();
		dto.setId(option.getId());
		dto.setName(option.getName());
		dto.setType(option.getType().name());
		dto.setValues(option.getValues().stream().map(value -> {
			OptionValueDTO valueDTO = new OptionValueDTO();
			valueDTO.setId(value.getId());
			valueDTO.setValue(value.getValue());
			valueDTO.setAdditionalPrice(value.getAdditionalPrice());
			return valueDTO;
		}).collect(Collectors.toList()));
		return dto;
	}

	/**
	 * Creates a CoffeeProduct based on the provided ProductDTO. This method
	 * validates the product details, determines the correct factory based on the
	 * product type, and creates the corresponding CoffeeProduct. The created
	 * product is then saved to the product repository.
	 *
	 * @param product The ProductDTO containing product information.
	 * @return The created CoffeeProduct instance.
	 * @throws InvalidProductInfoException If the product information is invalid or
	 *                                     the product type is unrecognized.
	 */
	public CoffeeProduct createProduct(ProductDTO product) {
		CoffeeFactory coffeeFactory;
		productValidator = new ProductValidator(product);
		if (!productValidator.validateProduct()) {
			throw new InvalidProductInfoException();
		}
		if (product.getType().equals("PACKAGED_COFFEE")) {
			coffeeFactory = new PackagedCoffeeFactory();
		} else if (product.getType().equals("READY_TO_DRINK_COFFEE")) {
			coffeeFactory = new ReadyToDrinkCoffeeFactory();
		} else if (product.getType().equals("GROUND_COFFEE")) {
			coffeeFactory = new GroundFactory();
		} else
			throw new InvalidProductInfoException();

		CoffeeProduct coffee = coffeeFactory.createCoffee(product);
		coffee.setCreateAt(LocalDateTime.now());
		coffee.setUpdateAt(LocalDateTime.now());
		productRepository.save(coffee);

		if (product.getOptions() != null) {
			processOptions(coffee, product.getOptions());
		}
		return coffee;
	}

	/**
	 * Updates an existing CoffeeProduct.
	 * 
	 * @param product product the CoffeeProduct to be updated
	 * @return
	 */
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
		if (productDTO.getOptions() != null) {
			processOptions(product, productDTO.getOptions());
		}
		productRepository.save(product);
		return mapToProductResponseDTO(product);
	}

	/**
	 * Deletes a product by its ID
	 * 
	 * @param id
	 * @throws ProductNotfoundException if the product does not exist
	 */

	@Transactional
	public CoffeeProduct deleteProduct(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());

		// Lấy các ProductOption liên kết với product
		List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(id);

		for (ProductOption productOption : productOptions) {
			Long optionId = productOption.getOption().getId();

			productOptionRepository.delete(productOption);

			boolean stillUsed = productOptionRepository.existsByOptionId(optionId);
			if (!stillUsed) {
				optionRepository.findById(optionId).ifPresent(optionRepository::delete);
			}
		}

		// Xóa chính CoffeeProduct
		productRepository.deleteById(id);

		return product;
	}

	/**
	 * Helper method to process options for a product.
	 */

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
				// Clear existing OptionValues (orphanRemoval will delete them)
				existingOption.getValues().clear();
				option = optionRepository.save(existingOption);

				for (OptionValueDTO valueDTO : optionDTO.getValues()) {
					OptionValue optionValue = new OptionValue();
					optionValue.setOption(option);
					optionValue.setValue(valueDTO.getValue());
					optionValue.setAdditionalPrice(valueDTO.getAdditionalPrice());
					option.getValues().add(optionValue); // Add to collection
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
					option.getValues().add(optionValue); // Add to collection
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
		dto.setType(product instanceof GroundCoffee ? "GROUND_COFFEE"
				: product instanceof PackagedCoffee ? "PACKAGED_COFFEE"
						: product instanceof ReadyToDrinkCoffee ? "READY_TO_DRINK_COFFEE" : null);

		if (product instanceof GroundCoffee) {
			GroundCoffee groundCoffee = (GroundCoffee) product;
			dto.getSpecificAttributesDTO().setRoastLevel(groundCoffee.getRoastLevel());
			dto.getSpecificAttributesDTO().setOrigin(groundCoffee.getOrigin());
			dto.getSpecificAttributesDTO().setRoastDate(groundCoffee.getRoastDate());
		} else if (product instanceof PackagedCoffee) {
			PackagedCoffee packagedCoffee = (PackagedCoffee) product;
			dto.getSpecificAttributesDTO().setPackType(packagedCoffee.getPackType());
			dto.getSpecificAttributesDTO().setInstructions(packagedCoffee.getInstructions());
			dto.getSpecificAttributesDTO().setExpireDate(packagedCoffee.getExpireDate());
		} else if (product instanceof ReadyToDrinkCoffee) {
			ReadyToDrinkCoffee readyToDrinkCoffee = (ReadyToDrinkCoffee) product;
			dto.getSpecificAttributesDTO().setDrinkType(readyToDrinkCoffee.getDrinkType());
			dto.getSpecificAttributesDTO().setIngredients(readyToDrinkCoffee.getIngredients());
			dto.getSpecificAttributesDTO().setPreparationTime(readyToDrinkCoffee.getPreparationTime());
		}

		// Map options (giả định OptionDTO và Option tương thích)
		// dto.setOptions(...);
		return dto;
	}

	/**
	 * Retrieves a paginated list of newest products based on creation date.
	 *
	 * @param page the page number (0-based)
	 * @param size the number of items per page
	 * @return a GetProductsResponseDTO containing the paginated products
	 */
	public GetProductsResponseDTO getNewestProducts(int page, int size) {
		if (page < 0 || size <= 0) {
			throw new IllegalArgumentException("Page index must be >= 0 and size > 0.");
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
			throw new IllegalArgumentException("Failed to retrieve newest products: " + e.getMessage());
		}
		return response;
	}

	/**
	 * Retrieves a paginated list of best-selling products based on order count.
	 *
	 * @param page the page number (0-based)
	 * @param size the number of items per page
	 * @return a GetProductsResponseDTO containing the paginated products
	 */
//	public GetProductsResponseDTO getBestSellingProducts(int page, int size) {
//		if (page < 0 || size <= 0) {
//			throw new IllegalArgumentException("Page index must be >= 0 and size > 0.");
//		}
//		GetProductsResponseDTO response = new GetProductsResponseDTO();
//		try {
//			Pageable pageable = PageRequest.of(page, size);
//			// Assume a custom query to join with orders and count
//			Page<CoffeeProduct> coffeePage = productRepository.findBestSellingProducts(pageable);
//
//			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
//					.collect(Collectors.toList());
//
//			response.setProducts(productDTOs);
//			response.setCurrentPage(coffeePage.getNumber());
//			response.setTotalItems(coffeePage.getTotalElements());
//			response.setTotalPage(coffeePage.getTotalPages());
//		} catch (Exception e) {
//			throw new IllegalArgumentException("Failed to retrieve best-selling products: " + e.getMessage());
//		}
//		return response;
//	}

	/**
	 * Retrieves a paginated list of products filtered by type.
	 *
	 * @param type the product type (e.g., GROUND_COFFEE, PACKAGED_COFFEE,
	 *             READY_TO_DRINK_COFFEE)
	 * @param page the page number (0-based)
	 * @param size the number of items per page
	 * @return a GetProductsResponseDTO containing the paginated products
	 */
	public GetProductsResponseDTO getProductsByType(String type, int page, int size) {
		if (page < 0 || size <= 0) {
			throw new IllegalArgumentException("Page index must be >= 0 and size > 0.");
		}
		if (!List.of("GROUND_COFFEE", "PACKAGED_COFFEE", "READY_TO_DRINK_COFFEE").contains(type)) {
			throw new IllegalArgumentException("Invalid product type: " + type);
		}
		GetProductsResponseDTO response = new GetProductsResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage;
			if (type.equals("GROUND_COFFEE")) {
				coffeePage = productRepository.findByType(GroundCoffee.class, pageable);
			} else if (type.equals("PACKAGED_COFFEE")) {
				coffeePage = productRepository.findByType(PackagedCoffee.class, pageable);
			} else {
				coffeePage = productRepository.findByType(ReadyToDrinkCoffee.class, pageable);
			}

			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			throw new IllegalArgumentException("Failed to retrieve products by type: " + e.getMessage());
		}
		return response;
	}

	/**
	 * Retrieves a paginated list of products with optional type filtering.
	 *
	 * @param type optional product type (e.g., GROUND_COFFEE, PACKAGED_COFFEE,
	 *             READY_TO_DRINK_COFFEE)
	 * @param page the page number (0-based)
	 * @param size the number of items per page
	 * @return a GetProductsResponseDTO containing the paginated products
	 */
	public GetProductsResponseDTO getProducts(String type, int page, int size) {
		if (page < 0 || size <= 0) {
			throw new IllegalArgumentException("Page index must be >= 0 and size > 0.");
		}
		if (type != null && !List.of("GROUND_COFFEE", "PACKAGED_COFFEE", "READY_TO_DRINK_COFFEE").contains(type)) {
			throw new IllegalArgumentException("Invalid product type: " + type);
		}
		GetProductsResponseDTO response = new GetProductsResponseDTO();
		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffeePage;
			if (type == null) {
				coffeePage = productRepository.findAll(pageable);
			} else if (type.equals("GROUND_COFFEE")) {
				coffeePage = productRepository.findByType(GroundCoffee.class, pageable);
			} else if (type.equals("PACKAGED_COFFEE")) {
				coffeePage = productRepository.findByType(PackagedCoffee.class, pageable);
			} else {
				coffeePage = productRepository.findByType(ReadyToDrinkCoffee.class, pageable);
			}

			List<ProductResponseDTO> productDTOs = coffeePage.getContent().stream().map(this::mapToProductResponseDTO)
					.collect(Collectors.toList());

			response.setProducts(productDTOs);
			response.setCurrentPage(coffeePage.getNumber());
			response.setTotalItems(coffeePage.getTotalElements());
			response.setTotalPage(coffeePage.getTotalPages());
		} catch (Exception e) {
			throw new IllegalArgumentException("Failed to retrieve products: " + e.getMessage());
		}
		return response;
	}

	/**
	 * Retrieves all options for admin view.
	 */
	public List<Option> getOptions() {
		return optionRepository.findAll();
	}

}
