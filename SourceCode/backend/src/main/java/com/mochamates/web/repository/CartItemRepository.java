package com.mochamates.web.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

}
