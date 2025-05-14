import React from 'react';
import './CategoryPage.css';
import Item from '../../../components/item/Item';

const ReadyCoffeePage = () => {
  const products = [
    { id: 1, name: 'Cà phê Sữa Đá Pha Sẵn', price: '2.50', description: 'Hương vị đậm đà, tiện lợi để mang đi.', imageUrl: 'https://images.unsplash.com/photo-1519750549750-6c3db38c9d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNnx8Y2FmZSUyMHNob3B8ZW58MHwxfHx8MTcyMTIxMTkwNnww&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 2, name: 'Cà phê Đen Pha Sẵn', price: '2.00', description: 'Cà phê đen nguyên chất, đóng lon tiện dụng.', imageUrl: 'https://images.unsplash.com/photo-1507915135761-5befc1c6ce3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8Y29mZmVlJTIwY3VwfGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 3, name: 'Cà phê Latte Pha Sẵn', price: '3.00', description: 'Latte kem béo, sẵn sàng thưởng thức.', imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2ZmZWUlMjBsYXR0ZXxlbnwwfDB8fHwxNzMwNTU1MzY5fDA&ixlib=rb-4.0.3&q=80&w=1080' },
  ];

  return (
    <div className="category-page home-section">
      <div className="container">
        <h2 className="home-title text-center py-3">Cà phê Pha Sẵn</h2>
        <div className="category-grid">
          {products.map(product => (
            <div className="col-md-2 col-sm-3 col-4" key={product.id}>
              <Item name={product.name} imageUrl={product.imageUrl} price={product.price} description={product.description} badge="New" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadyCoffeePage;