package com.mochamates.web.controller.cart;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.cart.CartDTO;
import com.mochamates.web.entities.Cart;
import com.mochamates.web.entities.CartItem;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.CartService;

/**
 * REST controller for managing cart-related operations. Provides endpoints for
 * adding, updating, removing items, and retrieving cart
 * 
 * Base path: /api/v1/carts
 */

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {
	private CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	@GetMapping("/{userId}")
	public ResponseEntity<ApiResponse<Cart>> getCart(@PathVariable Long userId) {
		Cart cart = cartService.getCartByUserId(userId);

		ApiResponse<Cart> response = new ApiResponse<Cart>("1000", "OK", cart);
		return ResponseEntity.status(200).body(response);
	}

	/**
	 * Adds a product to the user's cart.
	 * 
	 * @param userId
	 * @param cartDTO
	 * @return a responseEntity containing the updated cart
	 */
	@PostMapping("/{userId}/items")
	public ResponseEntity<ApiResponse<CartItem>> addItemToCart(@PathVariable Long userId,
			@RequestBody CartDTO cartDTO) {
		CartItem addedItem = cartService.addItemToCart(userId, cartDTO);

		ApiResponse<CartItem> response = new ApiResponse<CartItem>("1000", "OK", addedItem);
		return ResponseEntity.status(201).body(response);

	}
}
