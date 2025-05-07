package com.mochamates.web.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.entities.products.CoffeeFactory;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.GroundFactory;
import com.mochamates.web.entities.products.PackagedCoffeeFactory;
import com.mochamates.web.entities.products.ReadyToDrinkCoffeeFactory;
import com.mochamates.web.exception.InvalidProductInfoException;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.validators.ProductValidator;

@Service
public class ProductService {
	private ProductRepository productRepository;
	private List<CoffeeProduct> listProducts;
	private ProductValidator productValidator;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	public GetProductsResponseForAdmin getProductsForAdmin() {
		List<CoffeeProduct> products = productRepository.findAll();

		GetProductsResponseForAdmin response = new GetProductsResponseForAdmin();
		response.setProducts(products);

		return response;
	}

	public Optional<CoffeeProduct> getProductById(Long id) {
		Optional<CoffeeProduct> product = productRepository.findById(id);

		return product;
	}

	public List<CoffeeProduct> searchProducts() {
		List<CoffeeProduct> listProduct = new ArrayList<CoffeeProduct>();

		return listProducts;
	}

	public boolean checkStockAvailability(Long id) {
		Optional<CoffeeProduct> productOptional = productRepository.findById(id);

		if (!productOptional.isPresent()) {
			return false;
		}
		CoffeeProduct product = productOptional.get();

		return true;
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
		return coffee;
	}

	/**
	 * 
	 * 
	 * @param product
	 * @return
	 */
	public CoffeeProduct updateProduct(CoffeeProduct product) {
		return product;
	}

	public void deleteProduct(Long id) {
		Optional<CoffeeProduct> product = productRepository.findById(id);
		if (!product.isPresent()) {

		}
		productRepository.deleteById(id);
	}

}
