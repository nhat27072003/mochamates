package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.products.ProductOption;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {

	List<ProductOption> findByCoffeeProductId(Long productId);

	void deleteByCoffeeProductId(Long id);

	boolean existsByOptionId(Long id);

}
