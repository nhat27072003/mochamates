package com.mochamates.web.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mochamates.web.dto.cart.CartDTO;
import com.mochamates.web.entities.Cart;
import com.mochamates.web.entities.CartItem;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.CartItemRepository;
import com.mochamates.web.repository.CartRepository;

@Service
public class CartService {
	private CartRepository cartRepository;
	private CartItemRepository cartItemRepository;
	private UserService userService;
	private ProductService productService;

	public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, UserService userService,
			ProductService productService) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.userService = userService;
		this.productService = productService;
	}

	public Cart getCartByUserId(Long userId) {
		if (!userService.isUserExist(userId))
			throw new UserNotFoundException();

		Optional<Cart> cartOptional = cartRepository.findByUserId(userId);
		Cart cart;
		if (cartOptional.isEmpty()) {
			cart = new Cart(userId);
			cartRepository.save(cart);
		} else {
			cart = cartOptional.get();
		}
		return cart;
	}

	public CartItem addItemToCart(Long userId, CartDTO cartDTO) {
		if (!userService.isUserExist(userId))
			throw new UserNotFoundException();
		CoffeeProduct product = productService.getProductById(cartDTO.getProductId());
		if (product == null)
			throw new ProductNotFoundException();

		Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> new Cart(userId));
		Optional<CartItem> existingCartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(),
				cartDTO.getProductId());
		CartItem cartItem;
		if (existingCartItem.isPresent()) {
			cartItem = existingCartItem.get();
			cartItem.setQuantity(cartItem.getQuantity() + cartDTO.getQuantity());
		} else {
			cartItem = new CartItem(cart, product, cartDTO.getQuantity());
		}
		cartRepository.save(cart);
		cartItemRepository.save(cartItem);
		return cartItem;
	}
}
