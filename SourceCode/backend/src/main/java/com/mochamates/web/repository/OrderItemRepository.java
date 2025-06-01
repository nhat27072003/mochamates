package com.mochamates.web.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.order.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	List<OrderItem> findByOrderId(Long orderId);

	@Query("SELECT oi.productId, oi.name, SUM(oi.quantity) as totalSold, SUM(oi.totalPrice) as totalRevenue "
			+ "FROM OrderItem oi JOIN oi.order o " + "WHERE o.createAt BETWEEN :dateFrom AND :dateTo "
			+ "GROUP BY oi.productId, oi.name " + "ORDER BY totalSold DESC")
	List<Object[]> findTopSellingProducts(@Param("dateFrom") LocalDateTime dateFrom,
			@Param("dateTo") LocalDateTime dateTo, Pageable pageable);
}
