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

	@Query("SELECT DATE_TRUNC('day', o.createAt) as period, SUM(o.total) as revenue, COUNT(o) as orderCount "
			+ "FROM Order o WHERE o.createAt BETWEEN :startDate AND :endDate "
			+ "AND o.status IN ('PAID', 'DELIVERED') " + "GROUP BY DATE_TRUNC('day', o.createAt)")
	List<Object[]> findRevenueByDay(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT DATE_TRUNC('month', o.createAt) as period, SUM(o.total) as revenue, COUNT(o) as orderCount "
			+ "FROM Order o WHERE o.createAt BETWEEN :startDate AND :endDate "
			+ "AND o.status IN ('PAID', 'DELIVERED') " + "GROUP BY DATE_TRUNC('month', o.createAt)")
	List<Object[]> findRevenueByMonth(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT DATE_TRUNC('year', o.createAt) as period, SUM(o.total) as revenue, COUNT(o) as orderCount "
			+ "FROM Order o WHERE o.createAt BETWEEN :startDate AND :endDate "
			+ "AND o.status IN ('PAID', 'DELIVERED') " + "GROUP BY DATE_TRUNC('year', o.createAt)")
	List<Object[]> findRevenueByYear(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT o FROM Order o WHERE " + "(:query IS NULL OR o.fullName LIKE %:query% OR o.id = :query) AND "
			+ "(:status IS NULL OR o.status = :status) AND " + "(:dateFrom IS NULL OR o.createAt >= :dateFrom) AND "
			+ "(:dateTo IS NULL OR o.createAt <= :dateTo) AND " + "(:totalMin IS NULL OR o.total >= :totalMin)")
	Page<Order> findOrdersWithFilters(@Param("query") String query, @Param("status") OrderStatus status,
			@Param("dateFrom") LocalDateTime dateFrom, @Param("dateTo") LocalDateTime dateTo,
			@Param("totalMin") Double totalMin, Pageable pageable);

}
