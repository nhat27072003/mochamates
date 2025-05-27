package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mochamates.web.entities.products.CoffeeProduct;

public interface ProductRepository extends JpaRepository<CoffeeProduct, Long> {
	@Query("SELECT p.id, p.name, p.description, p.price, p.imageUrl FROM CoffeeProduct p")
	List<CoffeeProduct> findAllBasic();

	<T extends CoffeeProduct> Page<CoffeeProduct> findByType(Class<T> type, Pageable pageable);

	// Find best-selling products (example query, assuming an orders table)
//	@Query("SELECT p FROM CoffeeProduct p LEFT JOIN OrderItem oi ON p.id = oi.product.id "
//			+ "GROUP BY p.id ORDER BY COUNT(oi.id) DESC")
//	Page<CoffeeProduct> findBestSellingProducts(Pageable pageable);
}
