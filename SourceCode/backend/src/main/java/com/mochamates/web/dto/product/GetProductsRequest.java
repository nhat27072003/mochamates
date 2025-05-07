package com.mochamates.web.dto.product;

public class GetProductsRequest {
	private int page;
	private int size;
	private String keyword;
	private Double minPrice;
	private Double maxPrice;

	public GetProductsRequest(int page, int size, String keyword, Double minPrice, Double maxPrice) {
		this.page = page;
		this.size = size;
		this.keyword = keyword;
		this.minPrice = minPrice;
		this.maxPrice = maxPrice;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Double getMinPrice() {
		return minPrice;
	}

	public void setMinPrice(Double minPrice) {
		this.minPrice = minPrice;
	}

	public Double getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(Double maxPrice) {
		this.maxPrice = maxPrice;
	}

}
