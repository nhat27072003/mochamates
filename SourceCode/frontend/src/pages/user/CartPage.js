import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { removeFromCart, clearCart } from '../../redux/cartSlice';
import { formatPrice } from '../../utils/helpers';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [promoCode, setPromoCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.productId]: item.quantity || 1 }), {})
  );

  const updateQuantity = (productId, change) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowModal(false);
    setQuantities({});
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const qty = quantities[item.productId] || 1;
      return sum + (item.totalPrice || 0) * qty;
    }, 0);
  };

  const shipping = 10000; // Fixed shipping cost in VND
  const total = calculateSubtotal() + shipping;

  const ConfirmationModal = () => (
    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">Xóa giỏ hàng?</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng không?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClearCart}
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ Hàng của bạn</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart text-center py-5">
            <h2 className="empty-title">Giỏ hàng của bạn đang trống</h2>
            <p className="empty-text">Khám phá các sản phẩm cà phê tuyệt vời của chúng tôi!</p>
            <a href="/" className="btn btn-primary">Tiếp Tục Mua Sắm</a>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mb-4">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cart-item card mb-3"
                  >
                    <div className="card-body d-flex align-items-center">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/80?text=Product+Image'}
                        alt={item.name}
                        className="cart-image me-3"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=Product+Image';
                        }}
                      />
                      <div className="cart-details flex-grow-1">
                        <h3 className="cart-name">{item.name}</h3>
                        {item.selectedOptions?.map((opt) => (
                          <p key={opt.optionId} className="cart-option mb-1">
                            <strong>{opt.name}:</strong> {opt.values.map((val) => val.value).join(', ')}
                            {opt.values.some((val) => val.additionalPrice > 0) &&
                              ` (+${formatPrice(opt.values.reduce((sum, val) => sum + (val.additionalPrice || 0), 0))})`}
                          </p>
                        ))}
                        <div className="quantity-control d-flex align-items-center mt-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(item.productId, -1)}
                            aria-label={`Giảm số lượng ${item.name}`}
                          >
                            <FiMinus />
                          </button>
                          <span className="mx-3">{quantities[item.productId] || 1}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(item.productId, 1)}
                            aria-label={`Tăng số lượng ${item.name}`}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                      <div className="cart-price text-end">
                        <p className="price-text">
                          {formatPrice((item.totalPrice || 0) * (quantities[item.productId] || 1))}
                        </p>
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Xóa ${item.name}`}
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="cart-content card sticky-top">
                <div className="card-body">
                  <h2 className="summary-title">Tổng Cộng</h2>
                  <div className="summary-details">
                    <div className="d-flex justify-content-between">
                      <span>Tạm tính</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Phí vận chuyển</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="d-flex justify-content-between total">
                      <span>Tổng</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Mã khuyến mãi"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => alert('Chuyển đến trang thanh toán (chưa triển khai)!')}
                    >
                      Thanh Toán
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setShowModal(true)}
                    >
                      Xóa Giỏ Hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModal && <ConfirmationModal />}
      </div>
    </div>
  );
};

export default CartPage;