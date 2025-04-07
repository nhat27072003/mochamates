package com.mochamates.web.controllers.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.entities.Product;
import com.mochamates.web.services.ProductService;

@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {
	private ProductService productService;

	public AdminProductController(ProductService productService) {
		this.productService = productService;
	}

	public ResponseEntity<List<Product>> getListProduct() {
		List<Product> products = productService.getAllProducts();
		return ResponseEntity.ok(products);
	}

	@PostMapping("/create")
	public ResponseEntity<Product> creatProduct(@RequestBody Product newProduct) {
		Product product = productService.createProduct(newProduct);
		return ResponseEntity.ok(product);
	}

	@PutMapping("/update")
	public ResponseEntity<Product> updateProduct(@RequestBody Product product) {
		productService.updateProduct(product);
		return ResponseEntity.ok(product);
	}

	@DeleteMapping("/delete")
	public void deleteProduct(@PathVariable Long id) {
		productService.deleteProduct(id);
	}
}
