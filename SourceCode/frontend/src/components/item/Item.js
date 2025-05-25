import React from 'react'
const Item = ({ name, imageUrl, price, rating = 4.5, description, badge = 'New' }) => {
  return (
    <div className="item-product-card bg-white rounded-4 shadow-sm position-relative">
      <span className={`badge ${badge === 'New' ? 'bg-danger' : 'bg-success'} item-badge`}>{badge}</span>
      <div className="overflow-hidden">
        <img src={imageUrl} className="item-product-image w-100" alt={name} />
      </div>
      <div className="p-2">
        <h6 className="fw-bold mb-1 item-product-title">{name}</h6>
        <div className="d-flex align-items-center mb-1">
          <div className="me-2">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`fas fa-star ${index < Math.floor(rating) ? 'text-warning' : index < rating ? 'fas fa-star-half-alt text-warning' : 'text-secondary'}`}
              ></i>
            ))}
          </div>
          <small className="text-muted">({rating}/5)</small>
        </div>
        {/* <p className="text-muted mb-1 product-description">{description}</p> */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="item-price">${price}</span>
          <button className="btn btn-sm item-btn-custom text-white p-2 rounded-pill">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default Item