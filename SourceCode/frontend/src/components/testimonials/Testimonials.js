import React from 'react'

import './Testimonials.css';

const Testimonials = () => {
  return (
    <div className="testimonials-section home-section py-4">
      <h2 className="home-title text-center">What Our Customers Say</h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="testimonial-card">
              <p className="testimonial-text">"The best coffee I've ever tasted! The Cà phê Sữa Đá is amazing."</p>
              <p className="testimonial-author">- Nguyen Van A</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="testimonial-card">
              <p className="testimonial-text">"Fast delivery and great quality. Highly recommend Mochamates."</p>
              <p className="testimonial-author">- Tran Thi B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
