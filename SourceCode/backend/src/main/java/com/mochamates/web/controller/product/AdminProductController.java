package com.mochamates.web.controller.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.ProductService;

@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {
	private ProductService productService;

	public AdminProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping()
	public ResponseEntity<ApiResponse<GetProductsResponseForAdmin>> getListProduct() {
		GetProductsResponseForAdmin responseForAdmin = productService.getProductsForAdmin();
		ApiResponse<GetProductsResponseForAdmin> response = new ApiResponse<GetProductsResponseForAdmin>("1000", "Ok",
				responseForAdmin);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/create")
	public ResponseEntity<ApiResponse<String>> creatProduct(@RequestBody ProductDTO newProduct) {
		productService.createProduct(newProduct);
		ApiResponse<String> response = new ApiResponse<String>("1000", "OK", "Create product success");
		return ResponseEntity.status(201).body(response);
	}

	@PutMapping("/update")
	public ResponseEntity<CoffeeProduct> updateProduct(@RequestBody CoffeeProduct product) {
		productService.updateProduct(product);
		return ResponseEntity.ok(product);
	}

	@DeleteMapping("/delete")
	public void deleteProduct(@PathVariable Long id) {
		productService.deleteProduct(id);
	}
}
