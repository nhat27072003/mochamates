package com.mochamates.web.dto.statistics;

import java.util.List;

import com.mochamates.web.dto.product.ProductDTO;

public class ProductStatisticsDTO {
	private List<ProductSalesDTO> topSellingProducts;
	private List<ProductDTO> lowStockProducts;

	// Getters and Setters
	public List<ProductSalesDTO> getTopSellingProducts() {
		return topSellingProducts;
	}

	public void setTopSellingProducts(List<ProductSalesDTO> topSellingProducts) {
		this.topSellingProducts = topSellingProducts;
	}

	public List<ProductDTO> getLowStockProducts() {
		return lowStockProducts;
	}

	public void setLowStockProducts(List<ProductDTO> lowStockProducts) {
		this.lowStockProducts = lowStockProducts;
	}
}