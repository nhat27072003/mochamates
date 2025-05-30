
package com.mochamates.web.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mochamates.web.dto.cart.CartItemDTO;
import com.mochamates.web.dto.cart.CartItemRequestDTO;
import com.mochamates.web.dto.cart.CartResponseDTO;
import com.mochamates.web.entities.User;
import com.mochamates.web.entities.cart.Cart;
import com.mochamates.web.entities.cart.CartItem;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.ReadyToDrinkCoffee;
import com.mochamates.web.entities.products.RoastedCoffee;
import com.mochamates.web.exception.CartException;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.CartItemRepository;
import com.mochamates.web.repository.CartRepository;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.repository.UserRepository;

@Service
public class CartService {
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final ObjectMapper objectMapper;

	public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
			ProductRepository productRepository, UserRepository userRepository) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.userRepository = userRepository;
		this.objectMapper = new ObjectMapper();
	}

	@Transactional
	public CartResponseDTO addItemToCart(CartItemRequestDTO request) {
		User user = getAuthenticatedUser();
		CoffeeProduct product = validateProduct(request.getProductId());
		Map<String, List<String>> selectedOptions = validateOptions(request.getProductId(),
				request.getSelectedOptions());

		Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUserId(user.getId());
			return cartRepository.save(newCart);
		});

		Optional<CartItem> existingItem = findMatchingCartItem(cart.getId(), request.getProductId(), selectedOptions);
		CartItem item = existingItem.orElseGet(CartItem::new);

		item.setCart(cart);
		item.setProductId(request.getProductId());
		item.setName(product.getName());
		item.setImageUrl(product.getImageUrl());
		item.setQuantity(existingItem.isPresent()
				? item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1)
				: (request.getQuantity() != null ? request.getQuantity() : 1));

		updateItemOptionsAndPrice(item, product, selectedOptions);
		cartItemRepository.save(item);
		return updateCartTotals(cart);
	}

	public CartResponseDTO getCart() {
		User user = getAuthenticatedUser();
		Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUserId(user.getId());
			return cartRepository.save(newCart);
		});
		return toCartResponseDTO(cart);
	}

	@Transactional
	public CartResponseDTO updateCartItem(Long itemId, Integer quantity) {

		User user = getAuthenticatedUser();
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new CartException("Cart not found"));
		CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new CartException("Cart item not found"));

		item.setQuantity(Math.max(0, quantity));
		if (item.getQuantity() == 0) {
			cartItemRepository.delete(item);
		} else {
			cartItemRepository.save(item);
		}
		return updateCartTotals(cart);
	}

	@Transactional
	public CartResponseDTO removeCartItem(Long itemId) {
		User user = getAuthenticatedUser();
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new CartException("Cart not found"));
		CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new CartException("Cart item not found"));
		cartItemRepository.delete(item);
		return updateCartTotals(cart);
	}

	@Transactional
	public void clearCart() {
		User user = getAuthenticatedUser();
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cart not found"));
		cartItemRepository.deleteByCartId(cart.getId());
		cart.setSubtotal(0.0);
		cart.setShipping(10000.0);
		cart.setTotal(10000.0);
		cartRepository.save(cart);
	}

	private User getAuthenticatedUser() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
	}

	private CoffeeProduct validateProduct(Long productId) {
		return productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException());
	}

	private Map<String, List<String>> validateOptions(Long productId, Map<String, List<String>> selectedOptions) {
		if (selectedOptions == null) {
			throw new IllegalArgumentException("Selected options cannot be null");
		}
		CoffeeProduct product = validateProduct(productId);
		List<Map<String, Object>> availableOptions = product.getOptionsWithPrices();

		if (product instanceof ReadyToDrinkCoffee) {
			validateOption(selectedOptions, "IceLevel", availableOptions, "Ice level is required");
			validateOption(selectedOptions, "SugarLevel", availableOptions, "Sugar level is required");
			validateOption(selectedOptions, "SizeOption", availableOptions, "Size option is required");
		} else if (product instanceof RoastedCoffee) {
			validateOption(selectedOptions, "RoastLevel", availableOptions, "Roast level is required");
			validateOption(selectedOptions, "GrindLevel", availableOptions, "Grind level is required");
			validateOption(selectedOptions, "Weight", availableOptions, "Weight is required");
		}

		return selectedOptions;
	}

	private void validateOption(Map<String, List<String>> selectedOptions, String optionName,
			List<Map<String, Object>> availableOptions, String errorMessage) {
		List<String> selectedValues = selectedOptions.get(optionName);
		if (selectedValues == null || selectedValues.isEmpty()) {
			throw new IllegalArgumentException(errorMessage);
		}
		boolean valid = availableOptions.stream().filter(opt -> optionName.equals(opt.get("type")))
				.anyMatch(opt -> selectedValues.contains(opt.get("value")));
		if (!valid) {
			throw new IllegalArgumentException("Invalid " + optionName.toLowerCase());
		}
	}

	private Optional<CartItem> findMatchingCartItem(Long cartId, Long productId,
			Map<String, List<String>> selectedOptions) {
		List<CartItem> cartItems = cartItemRepository.findByCartIdAndProductId(cartId, productId);
		String optionsJson;
		try {
			optionsJson = selectedOptions != null ? objectMapper.writeValueAsString(selectedOptions) : null;
		} catch (Exception e) {
			throw new RuntimeException("Error serializing options: " + e.getMessage(), e);
		}

		String finalOptionsJson = optionsJson;
		return cartItems.stream()
				.filter(item -> finalOptionsJson != null && finalOptionsJson.equals(item.getSelectedAttributes()))
				.findFirst();
	}

	private void updateItemOptionsAndPrice(CartItem item, CoffeeProduct product,
			Map<String, List<String>> selectedOptions) {
		try {
			if (selectedOptions != null) {
				item.setSelectedAttributes(objectMapper.writeValueAsString(selectedOptions));
				double totalPrice = product.getPrice() != null ? product.getPrice() : 0.0;
				List<Map<String, Object>> availableOptions = product.getOptionsWithPrices();

				for (Map.Entry<String, List<String>> entry : selectedOptions.entrySet()) {
					String optionName = entry.getKey();
					String selectedValue = entry.getValue() != null && !entry.getValue().isEmpty()
							? entry.getValue().get(0)
							: null;
					if (selectedValue != null) {
						for (Map<String, Object> option : availableOptions) {
							if (optionName.equals(option.get("type")) && selectedValue.equals(option.get("value"))) {
								totalPrice += ((Number) option.get("additionalPrice")).doubleValue();
								break;
							}
						}
					}
				}
				item.setPrice(totalPrice);
				item.setTotalPrice(totalPrice);
			} else {
				item.setSelectedAttributes(null);
				double price = product.getPrice() != null ? product.getPrice() : 0.0;
				item.setPrice(price);
				item.setTotalPrice(price);
			}
		} catch (Exception e) {
			throw new RuntimeException("Error processing options: " + e.getMessage(), e);
		}
	}

	private CartResponseDTO updateCartTotals(Cart cart) {
		List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
		double subtotal = items.stream().mapToDouble(item -> item.getTotalPrice() * item.getQuantity()).sum();
		double shipping = 10000.0;
		double total = subtotal + shipping;

		cart.setSubtotal(subtotal);
		cart.setShipping(shipping);
		cart.setTotal(total);
		cartRepository.save(cart);

		return toCartResponseDTO(cart);
	}

	private CartResponseDTO toCartResponseDTO(Cart cart) {
		CartResponseDTO response = new CartResponseDTO();
		response.setId(cart.getId());
		response.setUserId(cart.getUserId().toString());
		response.setSubtotal(cart.getSubtotal());
		response.setShipping(cart.getShipping());
		response.setTotal(cart.getTotal());

		List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
		List<CartItemDTO> itemDTOs = items.stream().map(item -> {
			CartItemDTO dto = new CartItemDTO();
			dto.setId(item.getId());
			dto.setProductId(item.getProductId());
			dto.setName(item.getName());
			dto.setPrice(item.getPrice());
			dto.setImageUrl(item.getImageUrl());
			dto.setTotalPrice(item.getTotalPrice());
			dto.setQuantity(item.getQuantity());
			try {
				@SuppressWarnings("unchecked")
				Map<String, List<String>> options = item.getSelectedAttributes() != null
						? objectMapper.readValue(item.getSelectedAttributes(), Map.class)
						: null;
				dto.setSelectedOptions(options);
			} catch (Exception e) {
				dto.setSelectedOptions(null);
			}
			return dto;
		}).collect(Collectors.toList());

		response.setItems(itemDTOs);
		return response;
	}
}