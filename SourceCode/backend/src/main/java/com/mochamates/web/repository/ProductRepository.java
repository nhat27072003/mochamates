package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mochamates.web.entities.products.CoffeeProduct;

public interface ProductRepository extends JpaRepository<CoffeeProduct, Long> {
	@Query("SELECT p.id, p.name, p.description, p.price, p.imageUrl FROM CoffeeProduct p")
	List<CoffeeProduct> findAllBasic();
}
