import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiX, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

const Searchpage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    priceRange: [0, 100],
    rating: null,
    availability: [],
    brands: [],
    tags: [],
  });
  const [sortOption, setSortOption] = useState("newest");
  const filterRef = useRef(null);

  // Sample products (replace with API call)
  const coffeeProducts = [
    {
      id: 1,
      productId: 101,
      name: "Ethiopian Yirgacheffe",
      description: "Light roast with floral and fruity notes",
      price: 24.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1587734361993-0275331181dd",
      category: "Whole Beans",
      inStock: true,
      brand: "Mochamates",
      tags: ["Organic", "Single Origin"],
    },
    {
      id: 2,
      productId: 102,
      name: "Colombian Supremo",
      description: "Medium roast with caramel sweetness",
      price: 19.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1587734361993-0275331181dd",
      category: "Ground Coffee",
      inStock: true,
      brand: "Mochamates",
      tags: ["Mild", "Organic"],
    },
  ];

  // Debounced search
  const handleSearch = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );

  // Filter change
  const handleFilterChange = useCallback((category, value) => {
    setSelectedFilters((prev) => ({ ...prev, [category]: value }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedFilters({
      categories: [],
      priceRange: [0, 100],
      rating: null,
      availability: [],
      brands: [],
      tags: [],
    });
  }, []);

  // Add to cart
  const handleAddToCart = useCallback(
    // (product) => {
    //   if (!isAuthenticated) {
    //     navigate("/signin");
    //     return;
    //   }
    //   dispatch(
    //     addToCart({
    //       productId: product.productId,
    //       quantity: 1,
    //       selectedOptions: [],
    //     })
    //   );
    // },
    // [dispatch, isAuthenticated, navigate]
  );

  // Filter products
  const filteredProducts = coffeeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedFilters.categories.length === 0 ||
      selectedFilters.categories.includes(product.category);
    const matchesPrice =
      product.price >= selectedFilters.priceRange[0] &&
      product.price <= selectedFilters.priceRange[1];
    const matchesTags =
      selectedFilters.tags.length === 0 ||
      selectedFilters.tags.every((tag) => product.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesPrice && matchesTags;
  });

  // Sort products
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
        return b.id - a.id;
    }
  });

  // Handle clicks outside Offcanvas
  useEffect(() => {
    if (!showFilters) return;
    const offcanvas = new window.bootstrap.Offcanvas(document.getElementById("filterOffcanvas"));
    offcanvas.show();
    return () => offcanvas.hide();
  }, [showFilters]);

  return (
    <div className="coffee-store bg-light min-vh-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-3">
        <div className="container">
          <div className="input-group mx-auto" style={{ maxWidth: "600px" }}>
            <span className="input-group-text bg-white border-end-0">
              <FiSearch className="text-secondary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Tìm kiếm cà phê, thương hiệu, hương vị..."
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search coffees"
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
      </header>

      <main className="container py-4">
        <div className="row g-4">
          {/* Filter Sidebar (Offcanvas on mobile) */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="card p-3">
              <h4 className="card-title h5 mb-3">Bộ lọc</h4>
              {/* Categories */}
              <div className="mb-3">
                <h5 className="h6">Loại cà phê</h5>
                {["Ground Coffee", "Whole Beans", "Espresso", "Latte Blends", "Cold Brew"].map(
                  (category) => (
                    <div key={category} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedFilters.categories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedFilters.categories, category]
                            : selectedFilters.categories.filter((c) => c !== category);
                          handleFilterChange("categories", newCategories);
                        }}
                      />
                      <label className="form-check-label" htmlFor={`category-${category}`}>
                        {category}
                      </label>
                    </div>
                  )
                )}
              </div>
              {/* Price Range */}
              <div className="mb-3">
                <h5 className="h6">Khoảng giá</h5>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
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
                  <span>${selectedFilters.priceRange[0]}</span>
                  <span>${selectedFilters.priceRange[1]}</span>
                </div>
              </div>
              {/* Tags */}
              <div className="mb-3">
                <h5 className="h6">Thẻ</h5>
                <div className="d-flex flex-wrap gap-2">
                  {["Organic", "Strong", "Mild", "Iced", "Single Origin"].map((tag) => (
                    <button
                      key={tag}
                      className={`btn btn-sm ${selectedFilters.tags.includes(tag) ? "btn-primary" : "btn-outline-secondary"
                        }`}
                      onClick={() => {
                        const newTags = selectedFilters.tags.includes(tag)
                          ? selectedFilters.tags.filter((t) => t !== tag)
                          : [...selectedFilters.tags, tag];
                        handleFilterChange("tags", newTags);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </button>
            </div>
          </aside>

          {/* Offcanvas for mobile */}
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="filterOffcanvas"
            aria-labelledby="filterOffcanvasLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="filterOffcanvasLabel">
                Bộ lọc
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowFilters(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              {/* Categories */}
              <div className="mb-3">
                <h5 className="h6">Loại cà phê</h5>
                {["Ground Coffee", "Whole Beans", "Espresso", "Latte Blends", "Cold Brew"].map(
                  (category) => (
                    <div key={category} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`mobile-category-${category}`}
                        checked={selectedFilters.categories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...selectedFilters.categories, category]
                            : selectedFilters.categories.filter((c) => c !== category);
                          handleFilterChange("categories", newCategories);
                        }}
                      />
                      <label className="form-check-label" htmlFor={`mobile-category-${category}`}>
                        {category}
                      </label>
                    </div>
                  )
                )}
              </div>
              {/* Price Range */}
              <div className="mb-3">
                <h5 className="h6">Khoảng giá</h5>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
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
                  <span>${selectedFilters.priceRange[0]}</span>
                  <span>${selectedFilters.priceRange[1]}</span>
                </div>
              </div>
              {/* Tags */}
              <div className="mb-3">
                <h5 className="h6">Thẻ</h5>
                <div className="d-flex flex-wrap gap-2">
                  {["Organic", "Strong", "Mild", "Iced", "Single Origin"].map((tag) => (
                    <button
                      key={tag}
                      className={`btn btn-sm ${selectedFilters.tags.includes(tag) ? "btn-primary" : "btn-outline-secondary"
                        }`}
                      onClick={() => {
                        const newTags = selectedFilters.tags.includes(tag)
                          ? selectedFilters.tags.filter((t) => t !== tag)
                          : [...selectedFilters.tags, tag];
                        handleFilterChange("tags", newTags);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>

          {/* Products */}
          <section className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <button
                className="btn btn-outline-secondary d-lg-none"
                onClick={() => setShowFilters(true)}
                aria-label="Toggle filters"
              >
                <FiFilter /> Bộ lọc
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
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
            <div className={`row row-cols-1 ${viewMode === "grid" ? "row-cols-md-2 row-cols-lg-3" : ""} g-4`}>
              {sortedProducts.length === 0 ? (
                <p className="text-center text-muted py-5">Không tìm thấy sản phẩm nào phù hợp.</p>
              ) : (
                sortedProducts.map((product) => (
                  <div key={product.id} className={viewMode === "grid" ? "col" : ""}>
                    <div className={`card h-100 ${viewMode === "list" ? "flex-row" : ""}`}>
                      <img
                        src={product.image}
                        className={`${viewMode === "grid" ? "card-img-top" : "img-fluid"
                          } object-fit-cover ${viewMode === "list" ? "w-25" : ""}`}
                        alt={product.name}
                        style={viewMode === "list" ? { maxWidth: "150px" } : { height: "200px" }}
                        loading="lazy"
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-muted">{product.description}</p>
                        <div className="d-flex gap-1 mb-2">
                          {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                            <AiFillStar key={i} className="text-warning" />
                          ))}
                          {product.rating % 1 !== 0 && <BsStarHalf className="text-warning" />}
                        </div>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="h5 mb-0">${product.price.toFixed(2)}</span>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(product)}
                          >
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-outline-secondary" disabled aria-label="Previous page">
                <FiChevronLeft />
              </button>
              <button className="btn btn-primary">1</button>
              <button className="btn btn-outline-secondary">2</button>
              <button className="btn btn-outline-secondary">3</button>
              <button className="btn btn-outline-secondary" aria-label="Next page">
                <FiChevronRight />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Searchpage;