package com.mochamates.web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mochamates.web.entities.order.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUserId(Long userId);
}
