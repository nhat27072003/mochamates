package com.mochamates.web.controllers.customer;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.entities.Product;
import com.mochamates.web.services.ProductService;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin("http://localhost:3000")
public class ProductController {
	private ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts() {
		List<Product> listProduct = productService.getAllProducts();
		return ResponseEntity.ok(listProduct);
	}

}
