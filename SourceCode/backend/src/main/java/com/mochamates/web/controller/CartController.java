package com.mochamates.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.cart.CartItemRequestDTO;
import com.mochamates.web.dto.cart.CartItemUpdateRequestDTO;
import com.mochamates.web.dto.cart.CartResponseDTO;
import com.mochamates.web.response.ApiResponse;
import com.mochamates.web.services.CartService;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
	private final CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	/**
	 * Adds an item to the user's cart.
	 *
	 * @param request DTO containing item details
	 * @return ResponseEntity with cart details
	 */
	@PostMapping
	public ResponseEntity<ApiResponse<CartResponseDTO>> addItemToCart(@RequestBody CartItemRequestDTO request) {
		CartResponseDTO responseDTO = cartService.addItemToCart(request);
		ApiResponse<CartResponseDTO> response = new ApiResponse<>("1000", "Item added to cart", responseDTO);
		return ResponseEntity.ok(response);
	}

	/**
	 * Retrieves the user's cart.
	 *
	 * @return ResponseEntity with cart details
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<CartResponseDTO>> getCart() {
		CartResponseDTO responseDTO = cartService.getCart();
		ApiResponse<CartResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
		return ResponseEntity.ok(response);
	}

	/**
	 * Updates a cart item's quantity or options.
	 *
	 * @param productId ID of the product to update
	 * @param request   DTO containing update details
	 * @return ResponseEntity with updated cart details
	 */
	@PutMapping("/{itemId}")
	public ResponseEntity<ApiResponse<CartResponseDTO>> updateCartItem(@PathVariable Long itemId,
			@RequestBody CartItemUpdateRequestDTO request) {
		CartResponseDTO responseDTO = cartService.updateCartItem(itemId, request);
		ApiResponse<CartResponseDTO> response = new ApiResponse<>("1000", "Item updated", responseDTO);
		return ResponseEntity.ok(response);
	}

	/**
	 * Removes an item from the cart.
	 *
	 * @param productId ID of the product to remove
	 * @return ResponseEntity with updated cart details
	 */
	@DeleteMapping("/{itemId}")
	public ResponseEntity<ApiResponse<CartResponseDTO>> removeCartItem(@PathVariable Long itemId) {
		CartResponseDTO responseDTO = cartService.removeCartItem(itemId);
		ApiResponse<CartResponseDTO> response = new ApiResponse<>("1000", "Item removed", responseDTO);
		return ResponseEntity.ok(response);
	}

	/**
	 * Clears the entire cart.
	 *
	 * @return ResponseEntity with confirmation message
	 */
	@DeleteMapping
	public ResponseEntity<ApiResponse<String>> clearCart() {
		cartService.clearCart();
		ApiResponse<String> response = new ApiResponse<>("1000", "Cart cleared", null);
		return ResponseEntity.ok(response);
	}

	/**
	 * Applies a promo code to the cart (mock).
	 *
	 * @param request DTO containing promo code
	 * @return ResponseEntity with promo code response
	 */
//    @PostMapping("/promo")
//    public ResponseEntity<ApiResponse<PromoResponseDTO>> applyPromoCode(@RequestBody PromoCodeRequestDTO request) {
//        PromoResponseDTO responseDTO = cartService.applyPromoCode(request);
//        ApiResponse<PromoResponseDTO> response = new ApiResponse<>("1000", "Ok", responseDTO);
//        return ResponseEntity.ok(response);
//    }
}