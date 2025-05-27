package com.mochamates.web.dto.product;

import java.util.List;

public class GetProductsResponseDTO {
	private List<ProductResponseDTO> products;
	private int currentPage;
	private int totalPage;
	private long totalItems;

	public GetProductsResponseDTO() {

	}

	public List<ProductResponseDTO> getProducts() {
		return products;
	}

	public void setProducts(List<ProductResponseDTO> products) {
		this.products = products;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public long getTotalItems() {
		return totalItems;
	}

	public void setTotalItems(long totalItems) {
		this.totalItems = totalItems;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

}
