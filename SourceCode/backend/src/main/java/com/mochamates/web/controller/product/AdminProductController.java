package com.mochamates.web.controller.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.product.GetProductsResponseForAdmin;
import com.mochamates.web.dto.product.ProductDTO;
import com.mochamates.web.dto.product.ProductResponseDTO;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.ProductService;

/**
 * REST controller for managing product-related operations for admin users.
 * Provides endpoints for listing, creating, updating, and deleting productsl.
 * 
 * Base path: /api/v1/admin/products
 */
@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {
	private ProductService productService;

	public AdminProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
		ProductResponseDTO productResponseDTO = productService.getProductById(id);
		ApiResponse<ProductResponseDTO> response = new ApiResponse<ProductResponseDTO>("1000", "Ok",
				productResponseDTO);
		return ResponseEntity.status(200).body(response);
	}

	/**
	 * Retrieves a paginated list of products for admin.
	 * 
	 * @param page the page number to retrieve (default is 0)
	 * @param size the size number of items per page (default is 10)
	 * @return a ResponseEntity containing an ApiResponse with the product list
	 */
	@GetMapping()
	public ResponseEntity<ApiResponse<GetProductsResponseForAdmin>> getListProduct(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

		GetProductsResponseForAdmin responseForAdmin = productService.getProductsForAdmin(page, size);
		ApiResponse<GetProductsResponseForAdmin> response = new ApiResponse<GetProductsResponseForAdmin>("1000", "Ok",
				responseForAdmin);
		return ResponseEntity.ok(response);
	}

	/**
	 * Creates a new product using the provided product data.
	 * 
	 * @param newProduct the productDTO containing product information
	 * @return a ResponseEntity containing an ApiResponse with a success message
	 */
	@PostMapping()
	public ResponseEntity<ApiResponse<CoffeeProduct>> creatProduct(@RequestBody ProductDTO newProduct) {
		CoffeeProduct savedCoffeeProduct = productService.createProduct(newProduct);
		ApiResponse<CoffeeProduct> response = new ApiResponse<CoffeeProduct>("1000", "OK", savedCoffeeProduct);
		return ResponseEntity.status(201).body(response);
	}

	/**
	 * Updates an existing product.
	 * 
	 * @param product the CoffeeProduct entity with updated fields
	 * @return a ResponseEntity containing the updated CoffeeProduct
	 */
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(@PathVariable long id,
			@RequestBody ProductDTO product) {
		ProductResponseDTO productUpdated = productService.updateProduct(id, product);
		ApiResponse<ProductResponseDTO> response = new ApiResponse<ProductResponseDTO>("1000", "Ok", productUpdated);

		return ResponseEntity.status(201).body(response);

	}

	/**
	 * Deletes a product by its ID.
	 * 
	 * @param id the ID of the product to delete
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<CoffeeProduct>> deleteProduct(@PathVariable Long id) {
		CoffeeProduct coffeeProduct = productService.deleteProduct(id);
		ApiResponse<CoffeeProduct> response = new ApiResponse<CoffeeProduct>("1000", "Delete product seccess",
				coffeeProduct);

		return ResponseEntity.status(200).body(response);
	}
}
