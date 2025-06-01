package com.mochamates.web.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.products.CoffeeProduct;

public interface ProductRepository extends JpaRepository<CoffeeProduct, Long> {
	@Query("SELECT p.id, p.name, p.description, p.price, p.imageUrl FROM CoffeeProduct p")
	List<CoffeeProduct> findAllBasic();

	Page<CoffeeProduct> findByType(String type, Pageable pageable);
	// Find best-selling products (example query, assuming an orders table)
//	@Query("SELECT p FROM CoffeeProduct p LEFT JOIN OrderItem oi ON p.id = oi.product.id "
//			+ "GROUP BY p.id ORDER BY COUNT(oi.id) DESC")
//	Page<CoffeeProduct> findBestSellingProducts(Pageable pageable);

//	@Query("SELECT p FROM CoffeeProduct p WHERE p.stock < :threshold")
//	List<CoffeeProduct> findByStockLessThan(@Param("threshold") int threshold);

	@Query("SELECT oi.productId, p.name, SUM(oi.quantity) as totalSold, SUM(oi.totalPrice) as totalRevenue "
			+ "FROM OrderItem oi JOIN CoffeeProduct p ON oi.productId = p.id " + "JOIN Order o ON oi.order.id = o.id "
			+ "WHERE o.createAt BETWEEN :startDate AND :endDate " + "AND o.status IN ('PAID', 'DELIVERED') "
			+ "GROUP BY oi.productId, p.name " + "ORDER BY totalSold DESC " + "LIMIT :limit")
	List<Object[]> findTopSellingProducts(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, @Param("limit") int limit);
}
