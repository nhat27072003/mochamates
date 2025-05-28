package com.mochamates.web.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mochamates.web.dto.cart.CartItemDTO;
import com.mochamates.web.dto.cart.CartItemRequestDTO;
import com.mochamates.web.dto.cart.CartItemUpdateRequestDTO;
import com.mochamates.web.dto.cart.CartResponseDTO;
import com.mochamates.web.dto.product.OptionDTO;
import com.mochamates.web.dto.product.OptionValueDTO;
import com.mochamates.web.entities.User;
import com.mochamates.web.entities.cart.Cart;
import com.mochamates.web.entities.cart.CartItem;
import com.mochamates.web.entities.products.CoffeeProduct;
import com.mochamates.web.entities.products.Option;
import com.mochamates.web.entities.products.OptionValue;
import com.mochamates.web.entities.products.ProductOption;
import com.mochamates.web.exception.CartException;
import com.mochamates.web.exception.InvalidProductInfoException;
import com.mochamates.web.exception.ProductNotFoundException;
import com.mochamates.web.exception.UserNotFoundException;
import com.mochamates.web.repository.CartItemRepository;
import com.mochamates.web.repository.CartRepository;
import com.mochamates.web.repository.OptionRepository;
import com.mochamates.web.repository.OptionValueRepository;
import com.mochamates.web.repository.ProductOptionRepository;
import com.mochamates.web.repository.ProductRepository;
import com.mochamates.web.repository.UserRepository;

@Service
public class CartService {
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final OptionRepository optionRepository;
	private final OptionValueRepository optionValueRepository;
	private final ProductOptionRepository productOptionRepository;
	private final UserRepository userRepository;
	private final ObjectMapper objectMapper;

	public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
			ProductRepository productRepository, OptionRepository optionRepository,
			OptionValueRepository optionValueRepository, ProductOptionRepository productOptionRepository,
			UserRepository userRepository) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.optionRepository = optionRepository;
		this.optionValueRepository = optionValueRepository;
		this.productOptionRepository = productOptionRepository;
		this.userRepository = userRepository;
		this.objectMapper = new ObjectMapper();
	}

	@Transactional
	public CartResponseDTO addItemToCart(CartItemRequestDTO request) {
		User user = getAuthenticatedUser();
		CoffeeProduct product = validateProduct(request.getProductId());
		List<OptionDTO> validatedOptions = validateAndFetchOptions(request.getProductId(),
				request.getSelectedOptions());

		Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUserId(user.getId());
			return cartRepository.save(newCart);
		});

		// Check for existing item with same product ID and options
		Optional<CartItem> existingItem = findMatchingCartItem(cart.getId(), request.getProductId(), validatedOptions);
		CartItem item = existingItem.orElseGet(CartItem::new);

		item.setCart(cart);
		item.setProductId(request.getProductId());
		item.setName(product.getName());
		item.setPrice(product.getPrice());
		item.setImageUrl(product.getImageUrl());
		item.setQuantity(existingItem.isPresent()
				? item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1)
				: (request.getQuantity() != null ? request.getQuantity() : 1));

		updateItemOptionsAndPrice(item, validatedOptions);
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
	public CartResponseDTO updateCartItem(Long itemId, CartItemUpdateRequestDTO request) {
		if (request.getQuantity() == null) {
			throw new IllegalArgumentException("Quantity must be provided for update");
		}

		User user = getAuthenticatedUser();
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new CartException("Cart not found"));

		CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new CartException("Cart item not found"));
//
//		item.setCart(cart);
//		item.setProductId(request.getProductId());
//		item.setName(product.getName());
//		item.setPrice(product.getPrice());
//		item.setImageUrl(product.getImageUrl());
//		item.setQuantity(existingItem.isPresent()
//				? item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1)
//				: (request.getQuantity() != null ? request.getQuantity() : 1));
//
//		updateItemOptionsAndPrice(item, validatedOptions);

		item.setQuantity(Math.max(0, request.getQuantity()));
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

	private List<OptionDTO> validateAndFetchOptions(Long productId, List<OptionDTO> selectedOptions) {
		if (selectedOptions == null || selectedOptions.isEmpty()) {
			return new ArrayList<>(); // Return empty list if no options provided
		}

		List<ProductOption> productOptions = productOptionRepository.findByCoffeeProductId(productId);
		List<OptionDTO> validatedOptions = new ArrayList<>();

		for (OptionDTO optionDTO : selectedOptions) {
			Option option = optionRepository.findById(optionDTO.getId()).orElseThrow(
					() -> new InvalidProductInfoException("Option with ID " + optionDTO.getId() + " not found"));

			boolean isValidOption = productOptions.stream()
					.anyMatch(po -> po.getOption().getId().equals(optionDTO.getId()));
			if (!isValidOption) {
				throw new InvalidProductInfoException(
						"Option " + optionDTO.getName() + " is not available for this product");
			}

			OptionDTO validatedOption = new OptionDTO();
			validatedOption.setId(option.getId());
			validatedOption.setName(option.getName());
			validatedOption.setType(option.getType().name());
			validatedOption
					.setRequired(productOptions.stream().filter(po -> po.getOption().getId().equals(option.getId()))
							.findFirst().map(ProductOption::isRequired).orElse(false));

			List<OptionValueDTO> validatedValues = new ArrayList<>();
			for (OptionValueDTO valueDTO : optionDTO.getValues()) {
				OptionValue optionValue = optionValueRepository.findById(valueDTO.getId())
						.orElseThrow(() -> new InvalidProductInfoException(
								"Option value with ID " + valueDTO.getId() + " not found"));
				if (!optionValue.getOption().getId().equals(optionDTO.getId())) {
					throw new InvalidProductInfoException("Option value " + valueDTO.getValue()
							+ " does not belong to option " + optionDTO.getName());
				}
				OptionValueDTO validatedValue = new OptionValueDTO();
				validatedValue.setId(optionValue.getId());
				validatedValue.setValue(optionValue.getValue());
				validatedValue.setAdditionalPrice(optionValue.getAdditionalPrice());
				validatedValues.add(validatedValue);
			}
			validatedOption.setValues(validatedValues);
			validatedOptions.add(validatedOption);
		}

		// Check for required options
		List<Long> selectedOptionIds = validatedOptions.stream().map(OptionDTO::getId).collect(Collectors.toList());
		for (ProductOption productOption : productOptions) {
			if (productOption.isRequired() && !selectedOptionIds.contains(productOption.getOption().getId())) {
				throw new InvalidProductInfoException(
						"Required option " + productOption.getOption().getName() + " is missing");
			}
		}

		return validatedOptions;
	}

	private Optional<CartItem> findMatchingCartItem(Long cartId, Long productId, List<OptionDTO> selectedOptions) {
		List<CartItem> cartItems = cartItemRepository.findByCartIdAndProductId(cartId, productId);
		if (selectedOptions == null || selectedOptions.isEmpty()) {
			return cartItems.stream()
					.filter(item -> item.getSelectedOptions() == null || item.getSelectedOptions().isEmpty())
					.findFirst();
		}

		String optionsJson;
		try {
			optionsJson = objectMapper.writeValueAsString(selectedOptions);
			System.out.println("check delete" + cartItems.stream().toString());
		} catch (Exception e) {
			throw new RuntimeException("Error serializing options: " + e.getMessage(), e);
		}

		return cartItems.stream().filter(item -> optionsJson.equals(item.getSelectedOptions())).findFirst();
	}

	private void updateItemOptionsAndPrice(CartItem item, List<OptionDTO> selectedOptions) {
		try {
			if (selectedOptions != null && !selectedOptions.isEmpty()) {
				item.setSelectedOptions(objectMapper.writeValueAsString(selectedOptions));
				double optionPrice = selectedOptions.stream().flatMap(opt -> opt.getValues().stream())
						.mapToDouble(OptionValueDTO::getAdditionalPrice).sum();
				item.setTotalPrice(item.getPrice() + optionPrice);
			} else {
				item.setSelectedOptions(null);
				item.setTotalPrice(item.getPrice());
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
				List<OptionDTO> options = objectMapper.readValue(item.getSelectedOptions(),
						objectMapper.getTypeFactory().constructCollectionType(List.class, OptionDTO.class));
				dto.setSelectedOptions(options);
			} catch (Exception e) {
				dto.setSelectedOptions(new ArrayList<>());
			}
			return dto;
		}).collect(Collectors.toList());

		response.setItems(itemDTOs);
		return response;
	}
}