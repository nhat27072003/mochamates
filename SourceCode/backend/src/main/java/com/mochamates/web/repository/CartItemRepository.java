package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mochamates.web.entities.cart.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

	List<CartItem> findByCartId(Long cartId);

	@Modifying
	@Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId")
	void deleteByCartId(Long cartId);

	@Modifying
	@Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.productId = :productId")
	void deleteByCartIdAndProductId(Long cartId, Long productId);
}
