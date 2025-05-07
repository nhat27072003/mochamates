package com.mochamates.web.controller.product;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.services.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
	private ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

//	@GetMapping
//	public ResponseEntity<ApiResponse<GetProductsResponseForAdmin>> getProduts(@RequestParam(defaultValue = "0") int page,
//			@RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String keyword,
//			@RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice) {
//
//		GetProductsRequest request = new GetProductsRequest(page, size, keyword, minPrice, maxPrice);
//		GetProductsResponseForAdmin products = productService.getProducts(request);
//
//		ApiResponse<GetProductsResponseForAdmin> apiResponse = new ApiResponse<GetProductsResponseForAdmin>("1000", "OK", products);
//
//		return ResponseEntity.status(200).body(apiResponse);
//
//	}

}
