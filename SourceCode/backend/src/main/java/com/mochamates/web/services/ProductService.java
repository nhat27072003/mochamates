package com.mochamates.web.services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.OptionDTO;
import com.mochamates.web.dto.product.OptionValueDTO;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.dto.product.ProductResponseDTO;
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
		if (page < 0 || size <= 0)
			throw new InvalidProductInfoException("Page index must be >= 0 and size > 0.");
		GetProductsResponseForAdmin response = new GetProductsResponseForAdmin();

		try {
			Pageable pageable = PageRequest.of(page, size);
			Page<CoffeeProduct> coffePage = productRepository.findAll(pageable);

			response.setProducts(coffePage.getContent());
			response.setCurrentPage(coffePage.getNumber());
			response.setTotalItems(coffePage.getTotalElements());
			response.setTotalPage(coffePage.getTotalPages());
		} catch (IllegalArgumentException e) {
			throw new InvalidProductInfoException("Invalid pagination parameters");
		} catch (Exception e) {
			throw new InvalidProductInfoException("Failed to retrieve products");
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
		dto.setUpdateAt(product.getUpdate_at());
		dto.setType(product instanceof PackagedCoffee ? "PACKAGED_COFFEE"
				: product instanceof ReadyToDrinkCoffee ? "READY_TO_DRINK_COFFEE" : "GROUND_COFFEE");

		// Specific attributes
		Map<String, Object> specificAttributes = new HashMap<>();
		if (product instanceof ReadyToDrinkCoffee coffee) {
			specificAttributes.put("drinkType", coffee.getDrinkType());
			specificAttributes.put("preparationTime", coffee.getPreparationTime());
			specificAttributes.put("ingredients", coffee.getIngredients());
		} else if (product instanceof GroundCoffee coffee) {
			specificAttributes.put("origin", coffee.getOrigin());
			specificAttributes.put("roastLevel", coffee.getRoastLevel());
			specificAttributes.put("roastDate", coffee.getRoastDate());
		} else if (product instanceof PackagedCoffee coffee) {
			specificAttributes.put("packType", coffee.getPackType());
			specificAttributes.put("instructions", coffee.getInstructions());
			specificAttributes.put("expiryDate", coffee.getExpireDate());
		}
		dto.setSpecificAttributes(specificAttributes);

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
		product.setUpdate_at(new Date());
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

			// Xóa ProductOption
			productOptionRepository.delete(productOption);

			// Nếu Option không còn liên kết với product nào khác thì xóa Option
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
	private void processOptions(CoffeeProduct product, List<OptionDTO> optionDTOs) {
		for (OptionDTO optionDTO : optionDTOs) {
			Option option;
			if (optionDTO.getId() != null) {

				option = optionRepository.findById(optionDTO.getId())
						.orElseThrow(() -> new InvalidProductInfoException("Option not found: " + optionDTO.getId()));

			} else {
				// New option
				if (optionDTO.getName() == null || optionDTO.getType() == null || optionDTO.getValues() == null) {
					throw new InvalidProductInfoException("New option must have name, type, and values");
				}

				option = new Option();
				option.setName(optionDTO.getName());
				option.setType(OptionType.valueOf(optionDTO.getType()));
				option = optionRepository.save(option);

				// Save option values
				for (OptionValueDTO valueDTO : optionDTO.getValues()) {
					OptionValue optionValue = new OptionValue();
					optionValue.setOption(option);
					optionValue.setValue(valueDTO.getValue());
					optionValue.setAdditionalPrice(valueDTO.getAdditionalPrice());
					optionValueRepository.save(optionValue);

				}
			}

			// Link option to product
			ProductOption productOption = new ProductOption();
			productOption.setCoffeeProduct(product);
			productOption.setOption(option);
			productOption.setRequired(optionDTO.isRequired());
			productOptionRepository.save(productOption);

		}
	}

	/**
	 * Retrieves all options for admin view.
	 */
	public List<Option> getOptions() {
		return optionRepository.findAll();
	}

}
