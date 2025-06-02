import React, { useState } from 'react';
import './ProductList.css';
import Item from '../../../components/item/Item';

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Danh sách sản phẩm
  const products = [
    { id: 1, name: 'Cà phê Sữa Đá Pha Sẵn', type: 'Pha Sẵn', price: '2.50', description: 'Hương vị đậm đà, tiện lợi để mang đi.', imageUrl: 'https://images.unsplash.com/photo-1519750549750-6c3db38c9d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNnx8Y2FmZSUyMHNob3B8ZW58MHwxfHx8MTcyMTIxMTkwNnww&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 2, name: 'Cà phê Đen Pha Sẵn', type: 'Pha Sẵn', price: '2.00', description: 'Cà phê đen nguyên chất, đóng lon tiện dụng.', imageUrl: 'https://images.unsplash.com/photo-1507915135761-5befc1c6ce3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8Y29mZmVlJTIwY3VwfGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 3, name: 'Cà phê Latte Pha Sẵn', type: 'Pha Sẵn', price: '3.00', description: 'Latte kem béo, sẵn sàng thưởng thức.', imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2ZmZWUlMjBsYXR0ZXxlbnwwfDB8fHwxNzMwNTU1MzY5fDA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 4, name: 'Hạt Cà phê Robusta', type: 'Hạt', price: '8.00', description: 'Hạt cà phê nguyên chất, rang xay thủ công.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBwaGlufGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 5, name: 'Hạt Cà phê Arabica', type: 'Hạt', price: '10.00', description: 'Hạt cao cấp, hương vị thanh tao.', imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856abef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyMnx8Y29mZmVlJTIwc2hvcHxlbnwwfDB8fHwxNzMwNTU1MzY5fDA&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 6, name: 'Gói Cà phê Sữa Đá', type: 'Gói', price: '5.00', description: 'Gói pha sẵn, hương vị truyền thống Việt Nam.', imageUrl: 'https://images.unsplash.com/photo-1519750549750-6c3db38c9d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxNnx8Y2FmZSUyMHNob3B8ZW58MHwxfHx8MTcyMTIxMTkwNnww&ixlib=rb-4.0.3&q=80&w=1080' },
    { id: 7, name: 'Gói Cà phê Đen', type: 'Gói', price: '4.50', description: 'Gói cà phê đen nguyên chất, dễ pha.', imageUrl: 'https://images.unsplash.com/photo-1507915135761-5befc1c6ce3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8Y29mZmVlJTIwY3VwfGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080' },
  ];

  // Lọc sản phẩm theo searchQuery
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-list-section home-section">
      <div className="container">
        <h2 className="home-title text-center py-3">Product List</h2>
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="product-list-grid">
          {filteredProducts.map(product => (
            <div className="col-md-4 col-sm-6 col-12" key={product.id}>
              <Item
                name={product.name}
                imageUrl={product.imageUrl}
                price={product.price}
                description={product.description}
                rating={product.rating}
                badge={product.type === 'Pha Sẵn' ? 'New' : ''}
                options={product.options}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;