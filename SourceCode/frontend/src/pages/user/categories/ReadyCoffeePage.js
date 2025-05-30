import React, { useEffect, useState } from 'react';
import './CategoryPage.css';
import Item from '../../../components/item/Item';
import { fetchNewestProducts } from '../../../services/ProductService';

const ReadyCoffeePage = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchNewestProducts(0, 30);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="category-page home-section">
      <div className="container">
        <h2 className="home-title text-center py-3">Cà phê Pha Sẵn</h2>
        <div className="category-grid">
          {products.map(product => (
            <div className="col-md-3 col-sm-4 col-4" key={product.id}>
              <Item name={product.name} imageUrl={product.imageUrl} price={product.price} description={product.description} badge="New" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadyCoffeePage;