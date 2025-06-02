import React, { useState, useEffect } from 'react';
import Item from '../item/Item';
import { fetchProducts } from '../../services/ProductService';

const MenuPreview = () => {
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150?text=No+Image';
  const ITEMS_PER_PAGE = 8; // 2 rows of 3 items

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts(filterType || null, currentPage - 1, ITEMS_PER_PAGE);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError('Lỗi khi tải danh sách sản phẩm');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filterType, currentPage]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return PLACEHOLDER_IMAGE;
    }
    return `${imageUrl}?w=150&h=150&c=fill`;
  };

  const getBadge = (product) => {
    // Example: Mark products with high sales or specific type as "Hot"
    if (product.type === 'READY_TO_DRINK_COFFEE') return 'Hot';
    return null;
  };

  return (
    <div className="menu-preview-section home-section pb-3">
      <h2 className="home-title text-center py-3">Sản phẩm của chúng tôi</h2>
      <div className="container">
        {/* <div className="mb-3">
          <div className="row g-3">
            <div className="col-md-4 offset-md-4">
              <select
                className="form-select"
                value={filterType}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả sản phẩm</option>
                <option value="READY_TO_DRINK_COFFEE">Cà phê pha sẵn</option>
                <option value="GROUND_COFFEE">Cà phê hạt/xay</option>
                <option value="PACKAGED_COFFEE">Cà phê đóng gói</option>
              </select>
            </div>
          </div>
        </div> */}
        {/* {error && <div className="alert alert-danger small text-center">{error}</div>} */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="menu-preview-grid">
              {products.length === 0 ? (
                <div className="text-center">Không có sản phẩm nào</div>
              ) : (
                <div className="row">
                  {products.map((product) => (
                    <div key={product.id} className="col-md-3 col-sm-4 mb-3">
                      <Item
                        id={product.id}
                        name={product.name}
                        imageUrl={getImageUrl(product.imageUrl)}
                        price={product.price.toFixed(2)}
                        description={product.description || 'No description available'}
                        badge={getBadge(product)}
                        options={product.options}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPreview;