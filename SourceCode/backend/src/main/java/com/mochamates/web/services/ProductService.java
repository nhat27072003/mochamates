package com.mochamates.web.services;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.entities.products.CoffeeFactory;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.GroundFactory;
import com.mochamates.web.entities.products.PackagedCoffeeFactory;
import com.mochamates.web.entities.products.ReadyToDrinkCoffeeFactory;
import com.mochamates.web.exception.InvalidProductInfoException;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.validators.ProductValidator;

/**
 * Service class that handles business logic related to CoffeeProduct operation
 * includeing listing, creating, updating, and deleting products.
 */
@Service
public class ProductService {
	private ProductRepository productRepository;
	private List<CoffeeProduct> listProducts;
	private ProductValidator productValidator;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
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
	public CoffeeProduct getProductById(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());

		return product;
	}

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
		return coffee;
	}

	/**
	 * Updates an existing CoffeeProduct.
	 * 
	 * @param product product the CoffeeProduct to be updated
	 * @return
	 */
	public CoffeeProduct updateProduct(Long id, ProductDTO productDTO) {
		System.out.println("comehere");
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

		productRepository.save(product);
		return product;
	}

	/**
	 * Deletes a product by its ID
	 * 
	 * @param id
	 * @throws ProductNotfoundException if the product does not exist
	 */
	public CoffeeProduct deleteProduct(Long id) {
		CoffeeProduct product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException());

		productRepository.deleteById(id);

		return product;
	}

}
