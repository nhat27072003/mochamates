package com.mochamates.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.products.CoffeeProduct;

public interface ProductRepository extends JpaRepository<CoffeeProduct, Long> {

}
