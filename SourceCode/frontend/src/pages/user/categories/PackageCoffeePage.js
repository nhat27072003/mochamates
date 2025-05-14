import React from 'react';
import './CategoryPage.css';
import Item from '../../../components/item/Item';

const PackCoffeePage = () => {
  const products = [
    { id: 6, name: 'Gói Cà phê Sữa Đá', price: '5.00', description: 'Gói pha sẵn, hương vị truyền thống Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1519750549750-6c3db38c9d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNnx8Y2FmZSUyMHNob3B8ZW58MHwxfHx8MTcyMTIxMTkwNnww&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 7, name: 'Gói Cà phê Đen', price: '4.50', description: 'Gói cà phê đen nguyên chất, dễ pha.', imageUrl: 'https://images.unsplash.com/photo-1507915135761-5befc1c6ce3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8Y29mZmVlJTIwY3VwfGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
  ];

  return (
    <div className="category-page home-section">
      <div className="container">
        <h2 className="home-title text-center py-3">Cà phê Gói</h2>
        <div className="category-grid">
          {products.map(product => (
            <div className="col-md-2 col-sm-3 col-4" key={product.id}>
              <Item name={product.name} imageUrl={product.imageUrl} price={product.price} description={product.description} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackCoffeePage;