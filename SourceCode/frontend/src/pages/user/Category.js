import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiX, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";
import { debounce } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../../services/ProductService";
import { formatPrice } from "../../utils/helpers";
import Item from "../../components/item/Item";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams(); // Get category from URL (e.g., 'packaged', 'ground')
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [coffeeProducts, setCoffeeProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    priceRange: [0, 1000000],
    tags: [],
  });
  const [sortOption, setSortOption] = useState("newest");

  // Map URL category to product type
  const categoryMap = {
    packaged: "PACKAGED_COFFEE",
    ground: "GROUND_COFFEE",
    ready: "READY_TO_DRINK_COFFEE",
  };

  const selectedCategory = categoryMap[category] || "PACKAGED_COFFEE"; // Default to PACKAGED_COFFEE if invalid

  useEffect(() => {
    setSelectedFilters((prev) => ({ ...prev, type: [selectedCategory] }));
    const getProducts = async () => {
      try {
        const result = await fetchProducts(null, currentPage, 15);
        const products = result.products.map((product) => ({
          ...product,
          rating: Math.random() * (5 - 3) + 3, // Placeholder rating
        }));
        setCoffeeProducts(products);
        setTotalPages(result.totalPage);
        setCurrentPage(result.currentPage);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    getProducts();
  }, [currentPage, selectedCategory]);

  const handleSearch = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );

  const handleFilterChange = useCallback((category, value) => {
    setSelectedFilters((prev) => ({ ...prev, [category]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({
      type: [selectedCategory], // Keep the category filter
      priceRange: [0, 1000000],
      tags: [],
    });
  }, [selectedCategory]);

  const filteredProducts = coffeeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedFilters.type.length === 0 || selectedFilters.type.includes(product.type);
    const matchesPrice =
      product.price >= selectedFilters.priceRange[0] &&
      product.price <= selectedFilters.priceRange[1];
    return matchesSearch && matchesType && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return new Date(b.updateAt) - new Date(a.updateAt);
    }
  });

  useEffect(() => {
    if (!showFilters) return;
    const offcanvas = new window.bootstrap.Offcanvas(document.getElementById("filterOffcanvas"));
    offcanvas.show();
    return () => offcanvas.hide();
  }, [showFilters]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Category title mapping for display
  const categoryTitles = {
    packaged: "Packaged Coffee",
    ground: "Ground Coffee",
    ready: "Ready-to-Drink Coffee",
  };

  return (
    <div className="coffee-store bg-light min-vh-100">
      <main className="container-fluid p-4">
        <div className="container mb-3">
          <div className="input-group mx-auto" style={{ maxWidth: "600px" }}>
            <span className="input-group-text bg-white border-end-0">
              <FiSearch className="text-secondary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder={`Search ${categoryTitles[category] || "products"}...`}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchQuery("");
                  handleSearch("");
                }}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
        <div className="row g-4">
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="card p-3">
              <h4 className="card-title h5 mb-3">Filters</h4>
              <div className="mb-3">
                <h5 className="h6">Price Range</h5>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="1000000"
                  value={selectedFilters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      selectedFilters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  aria-label="Price range"
                />
                <div className="d-flex justify-content-between">
                  <span>{formatPrice(selectedFilters.priceRange[0])}</span>
                  <span>{formatPrice(selectedFilters.priceRange[1])}</span>
                </div>
              </div>
              <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </aside>

          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="filterOffcanvas"
            aria-labelledby="filterOffcanvasLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="filterOffcanvasLabel">
                Filters
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowFilters(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div className="mb-3">
                <h5 className="h6">Price Range</h5>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="1000000"
                  value={selectedFilters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      selectedFilters.priceRange[0],
                      parseInt(e.target.value),
                    ])
                  }
                  aria-label="Price range"
                />
                <div className="d-flex justify-content-between">
                  <span>{formatPrice(selectedFilters.priceRange[0])}</span>
                  <span>{formatPrice(selectedFilters.priceRange[1])}</span>
                </div>
              </div>
              <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>

          <section className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <button
                className="btn btn-outline-secondary d-lg-none"
                onClick={() => setShowFilters(true)}
                aria-label="Toggle filters"
              >
                <FiFilter /> Filters
              </button>
              <div className="d-flex gap-2">
                <button
                  className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
              <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <div className={`row row-cols-1 ${viewMode === "grid" ? "row-cols-md-2 row-cols-lg-3" : ""} g-4`}>
              {sortedProducts.length === 0 ? (
                <p className="text-center text-muted py-5">No products found.</p>
              ) : (
                sortedProducts.map((product) => (
                  <div key={product.id} className={viewMode === "grid" ? "col" : ""}>
                    <Item
                      id={product.id}
                      name={product.name}
                      imageUrl={product.imageUrl}
                      price={product.price}
                      rating={product.rating}
                      description={product.description}
                      badge={product.specificAttributesDTO.drinkType || "New"}
                      options={product.options}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn ${currentPage === index ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Category;