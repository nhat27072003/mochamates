package com.mochamates.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.product.GetProductsResponseDTO;
import com.mochamates.web.dto.product.ProductResponseDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
	private ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	/**
	 * Retrieves a paginated list of products with optional type filtering.
	 *
	 * @param type optional product type (e.g., GROUND_COFFEE, PACKAGED_COFFEE,
	 *             READY_TO_DRINK_COFFEE)
	 * 
	 * @param page the page number (default is 0)
	 * 
	 * @param size the number of items per page (default is 10)
	 * 
	 * @return a ResponseEntity containing an ApiResponse with the product list
	 */
	@GetMapping()
	public ResponseEntity<ApiResponse<GetProductsResponseDTO>> getProducts(@RequestParam(required = false) String type,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		GetProductsResponseDTO responseDTO = productService.getProducts(type, page, size);
		ApiResponse<GetProductsResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
		ProductResponseDTO productResponseDTO = productService.getProductById(id);
		ApiResponse<ProductResponseDTO> response = new ApiResponse<ProductResponseDTO>("1000", "Ok",
				productResponseDTO);
		return ResponseEntity.status(200).body(response);
	}

	/**
	 * Retrieves a paginated list of newest products based on creation date.
	 *
	 * @param page the page number (default is 0)
	 * @param size the number of items per page (default is 10)
	 * @return a ResponseEntity containing an ApiResponse with the product list
	 */
	@GetMapping("/newest")
	public ResponseEntity<ApiResponse<GetProductsResponseDTO>> getNewestProducts(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		GetProductsResponseDTO responseDTO = productService.getNewestProducts(page, size);
		ApiResponse<GetProductsResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves a paginated list of best-selling products.
	 *
	 * @param page the page number (default is 0)
	 * @param size the number of items per page (default is 10)
	 * @return a ResponseEntity containing an ApiResponse with the product list
	 */
//	@GetMapping("/best-selling")
//	public ResponseEntity<ApiResponse<GetProductsResponseDTO>> getBestSellingProducts(
//			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
//		GetProductsResponseDTO responseDTO = productService.getBestSellingProducts(page, size);
//		ApiResponse<GetProductsResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
//		return ResponseEntity.ok(response);
//	}

	/**
	 * Retrieves a paginated list of products by type.
	 *
	 * @param type the product type (e.g., GROUND_COFFEE, PACKAGED_COFFEE,
	 *             READY_TO_DRINK_COFFEE)
	 * @param page the page number (default is 0)
	 * @param size the number of items per page (default is 10)
	 * @return a ResponseEntity containing an ApiResponse with the product list
	 */
	@GetMapping("/by-type")
	public ResponseEntity<ApiResponse<GetProductsResponseDTO>> getProductsByType(@RequestParam String type,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		GetProductsResponseDTO responseDTO = productService.getProductsByType(type, page, size);
		ApiResponse<GetProductsResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

}
