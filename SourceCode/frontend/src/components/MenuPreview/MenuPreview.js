import React from 'react';
import './MenuPreview.css';
import Item from '../item/Item';


const MenuPreview = () => {
  return (
    <div className="menu-preview-section home-section pb-3">
      <h2 className="home-title text-center py-3">Our Menu</h2>
      <div className="container">
        <div className="menu-preview-grid">
          <div className="menu-preview-row">
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Sữa Đá"
                imageUrl="/img/banner1.jpg"
                price="3.50"
                description="Hương vị đậm đà của cà phê Việt Nam kết hợp với sữa đặc, phục vụ lạnh."
              />
            </div>
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Đen"
                imageUrl="/img/banner1.jpg"
                price="2.50"
                description="Cà phê đen nguyên chất, đậm đà, pha phin truyền thống."
                rating={5.0}
              />
            </div>
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Cappuccino"
                imageUrl="/img/banner1.jpg"
                price="2.00"
                description="Cappuccino béo ngậy với lớp kem sữa và cà phê espresso chuẩn vị."
                badge="Hot"
              />
            </div>
          </div>
          <div className="menu-preview-row">
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Latte"
                imageUrl="/img/banner1.jpg"
                price="2.50"
                description="Latte kem béo với espresso đậm đà, hương vị tinh tế."
              />
            </div>
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Phin Đặc Biệt"
                imageUrl="/img/banner1.jpg"
                price="3.00"
                description="Cà phê phin nguyên chất với hương vị vùng cao nguyên."
              />
            </div>
            <div className="col-md-2 col-sm-3">
              <Item
                name="Cà phê Mật Ong"
                imageUrl="/img/banner1.jpg"
                price="2.00"
                description="Cà phê ngọt ngào kết hợp với mật ong tự nhiên."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPreview;