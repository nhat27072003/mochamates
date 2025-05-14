import React from 'react';
import './CategoryPage.css';
import Item from '../../../components/item/Item';

const GroundCoffeePage = () => {
  const products = [
    { id: 4, name: 'Hạt Cà phê Robusta', price: '8.00', description: 'Hạt cà phê nguyên chất, rang xay thủ công.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBwaGlufGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 5, name: 'Hạt Cà phê Arabica', price: '10.00', description: 'Hạt cao cấp, hương vị thanh tao.', imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856abef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMnx8Y29mZmVlJTIwc2hvcHxlbnwwfDB8fHwxNzMwNTU1MzY5fDA&ixlib=rb-4.0.3&q=80&w=1080' },
  ];

  return (
    <div className="category-page home-section">
      <div className="container">
        <h2 className="home-title text-center py-3">Hạt Cà phê</h2>
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

export default GroundCoffeePage;