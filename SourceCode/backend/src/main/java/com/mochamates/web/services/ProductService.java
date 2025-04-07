package com.mochamates.web.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mochamates.web.entities.Product;
import com.mochamates.web.repository.ProductRepository;

@Service
public class ProductService {
	private ProductRepository productRepository;
	private List<Product> listProducts;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	public List<Product> getAllProducts() {
		List<Product> products;
		products = productRepository.findAll();

		return products;
	}

	public Optional<Product> getProductById(Long id) {
		Optional<Product> product = productRepository.findById(id);

		return product;
	}

	public List<Product> searchProducts() {
		List<Product> listProduct = new ArrayList<Product>();

		return listProducts;
	}

	public boolean checkStockAvailability(Long id) {
		Optional<Product> productOptional = productRepository.findById(id);

		if (!productOptional.isPresent()) {
			return false;
		}
		Product product = productOptional.get();

		return product.getStock() >= 1;
	}

	public Product createProduct(Product product) {

// 	CHECK PRODUCT	

//		if(product) {
//			
//		}

		productRepository.save(product);
		return product;
	}

	public Product updateProduct(Product product) {
		return product;
	}

	public void deleteProduct(Long id) {
		Optional<Product> product = productRepository.findById(id);
		if (!product.isPresent()) {

		}
		productRepository.deleteById(id);
	}
}
