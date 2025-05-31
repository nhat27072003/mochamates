package com.mochamates.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mochamates.web.dto.order.OrderResponseDTO;
import com.mochamates.web.services.OrderService;

@RestController
public class VNPayController {

	@Autowired
	private OrderService orderService;

	@GetMapping("/api/vnpay/callback")
	public OrderResponseDTO handleVNPayCallback(@RequestParam Map<String, String> params) {
		return orderService.processVNPayCallback(params);
	}
}