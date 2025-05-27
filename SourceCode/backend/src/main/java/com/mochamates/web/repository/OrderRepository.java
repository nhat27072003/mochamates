package com.mochamates.web.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mochamates.web.entities.order.Order;
import com.mochamates.web.entities.order.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUserId(Long userId);

	@Query("SELECT o FROM Order o WHERE "
			+ "(:q IS NULL OR CAST(o.id AS string) LIKE %:q% OR CAST(o.userId AS string) LIKE %:q%) "
			+ "AND (:status IS NULL OR o.status = :status) " + "AND (:dateFrom IS NULL OR o.createAt >= :dateFrom) "
			+ "AND (:dateTo IS NULL OR o.createAt <= :dateTo) " + "AND (:totalMin IS NULL OR o.total >= :totalMin)")
	Page<Order> findOrdersWithFilters(@Param("q") String query, @Param("status") OrderStatus status,
			@Param("dateFrom") LocalDateTime dateFrom, @Param("dateTo") LocalDateTime dateTo,
			@Param("totalMin") Double totalMin, Pageable pageable);
}
