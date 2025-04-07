package com.mochamates.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
