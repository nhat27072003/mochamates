import React, { useState, useEffect } from 'react';
import Item from '../item/Item';
import { fetchNewestProducts, fetchProducts } from '../../services/ProductService';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150?text=No+Image';
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNewestProducts(0, ITEMS_PER_PAGE,);
        setProducts(data.products || []);
      } catch (err) {
        setError('Lỗi khi tải sản phẩm mới');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
      return PLACEHOLDER_IMAGE;
    }
    return `${imageUrl}?w=150&h=150&c=fill`;
  };

  return (
    <div className="new-arrivals-section home-section py-4">
      <h2 className="home-title text-center">New Arrivals</h2>
      <div className="container">
        {error && <div className="alert alert-danger small text-center">{error}</div>}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            {products.length === 0 ? (
              <div className="text-center">Không có sản phẩm mới</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="col-md-3 col-sm-6 mb-3">
                  <Item
                    id={product.id}
                    name={product.name}
                    imageUrl={getImageUrl(product.imageUrl)}
                    price={product.price.toFixed(2)}
                    description={product.description || 'No description available'}
                    badge="New"
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;