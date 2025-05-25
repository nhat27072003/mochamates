import React from 'react'
import Item from '../item/Item';

const NewArrivals = () => {
  return (
    <div className="new-arrivals-section home-section py-4">
      <h2 className="home-title text-center">New Arrivals</h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-3">
            <Item
              name="Cà phê Phin Đặc Biệt"
              imageUrl="https://images.unsplash.com/photo-1554118811-1e0d58224f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBwaGlufGVufDB8MHx8fDE3MzA1NTUzNjl8MA&ixlib=rb-4.0.3&q=80&w=1080"
              price="3.00"
              description="Cà phê phin nguyên chất với hương vị đặc trưng của vùng cao nguyên."
            />
          </div>
          <div className="col-md-3">
            <Item
              name="Cà phê Latte Mật Ong"
              imageUrl="https://images.unsplash.com/photo-1490818387583-1baba5e638af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2ZmZWUlMjBsYXR0ZXxlbnwwfDB8fHwxNzMwNTU1MzY5fDA&ixlib=rb-4.0.3&q=80&w=1080"
              price="4.50"
              description="Latte ngọt ngào với mật ong tự nhiên và cà phê đậm đà."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
