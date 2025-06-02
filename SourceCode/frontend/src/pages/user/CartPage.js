
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { removeFromCart, clearCart, updateCartItem, fetchCart, applyPromoCode } from '../../redux/cartSlice';
import { formatPrice } from '../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, status, error: cartError } = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [promoCode, setPromoCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }), {})
  );
  const modalRef = useRef(null);
  const firstButtonRef = useRef(null);

  const labelMap = {
    IceLevel: {
      NO_ICE: "Không đá",
      LESS_ICE: "Ít đá",
      NORMAL_ICE: "Bình thường",
    },
    SugarLevel: {
      NO_SUGAR: "Không đường",
      LESS_SUGAR: "Ít đường",
      NORMAL_SUGAR: "Bình thường",
    },
    SizeOption: {
      SMALL: "Nhỏ",
      MEDIUM: "Vừa",
      LARGE: "Lớn",
    },
    RoastLevel: {
      LIGHT: "Rang nhạt",
      MEDIUM: "Rang vừa",
      DARK: "Rang đậm",
    },
    GrindLevel: {
      WHOLE_BEAN: "Nguyên hạt",
      FINE: "Xay mịn",
      MEDIUM: "Xay vừa",
      COARSE: "Xay thô",
    },
    Weight: {
      G250: "250g",
      G500: "500g",
      KG1: "1kg",
    },
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    setQuantities(
      cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }), {})
    );
  }, [cartItems]);

  useEffect(() => {
    if (showModal && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
    if (showModal) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowModal(false);
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showModal]);

  const updateQuantity = async (e, change, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = Math.max(1, (quantities[itemId] || 1) + change);
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const updatePayload = {
        quantity: newQty,
      };
      try {
        await dispatch(updateCartItem({ itemId, newQty })).unwrap();
      } catch (err) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
      }
    }
  };

  const removeItem = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      dispatch(fetchCart());
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      setShowModal(false);
      setQuantities({});
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      toast.info('Vui lòng nhập mã khuyến mãi');
      return;
    }
    try {
      await dispatch(applyPromoCode(promoCode)).unwrap();
      dispatch(fetchCart());
      setPromoCode('');
      toast.info('Mã khuyến mãi đã được áp dụng!');
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const qty = quantities[item.id] || item.quantity || 1;
      return sum + (item.totalPrice || item.price || 0) * qty;
    }, 0);
  };

  const shipping = 10000;
  const total = calculateSubtotal() + shipping;

  const ConfirmationModal = () => (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => setShowModal(false)}
        style={{ zIndex: 1040 }}
      ></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        aria-labelledby="modalLabel"
        aria-hidden={showModal ? "false" : "true"}
        ref={modalRef}
        role="dialog"
        style={{ zIndex: 1050 }}
      >
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
                ref={firstButtonRef}
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
    </>
  );

  const getOptionDisplayName = (optionName) => {
    return labelMap[optionName] ? optionName.replace(/([A-Z])/g, " $1").trim() : optionName;
  };

  const getOptionValueDisplay = (optionName, value) => {
    return labelMap[optionName] && labelMap[optionName][value] ? labelMap[optionName][value] : value;
  };

  return (
    <div className="cart-page">
      <div className="container-fluid">
        <div className="d-flex direction-column">
          <h1 className="page-title">Giỏ Hàng của bạn</h1>
          {status === 'loading' && (
            <div className="text-center ms-2">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          )}
        </div>
        {cartError && <div className="alert alert-danger">{cartError}</div>}
        {cartItems.length === 0 && status !== 'loading' ? (
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
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cart-item card mb-3"
                  >
                    <Link to={`/products/${item.productId}`}>
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/80?text=Product+Image'}
                          alt={item.name}
                          className="cart-image me-3"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=Product+Image';
                          }}
                        />
                        <div className="row cart-details flex-grow-1">
                          <h3 className="col-4 cart-name">{item.name}</h3>
                          <div className="col-4 option-item">
                            {item.selectedOptions &&
                              Object.entries(item.selectedOptions).map(([optionName, values]) => (
                                <p key={optionName} className="cart-option mb-1">
                                  <strong>{getOptionDisplayName(optionName)}:</strong>{' '}
                                  {values.map((value) => getOptionValueDisplay(optionName, value)).join(', ')}
                                </p>
                              ))}
                          </div>
                          <p className="col-2 price-text">
                            {formatPrice(item.totalPrice || item.price || 0)}
                          </p>
                          <div className="col-2 quantity-control d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={(e) => updateQuantity(e, -1, item.id)}
                              aria-label={`Giảm số lượng ${item.name}`}
                              disabled={status === 'loading' || quantities[item.id] <= 1}
                            >
                              <FiMinus />
                            </button>
                            <span className="mx-3">{quantities[item.id] || item.quantity || 1}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={(e) => updateQuantity(e, 1, item.id)}
                              aria-label={`Tăng số lượng ${item.name}`}
                              disabled={status === 'loading'}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                        <div className="cart-price text-end">
                          <p className="price-text">
                            {formatPrice((item.totalPrice || item.price || 0) * (quantities[item.id] || item.quantity || 1))}
                          </p>
                          <button
                            className="btn btn-link text-danger"
                            onClick={(e) => removeItem(e, item.id)}
                            aria-label={`Xóa ${item.name}`}
                            disabled={status === 'loading'}
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </Link>
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
                  {/* <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mã khuyến mãi"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleApplyPromoCode}
                      disabled={status === 'loading' || !promoCode}
                    >
                      Áp dụng
                    </button>
                  </div> */}
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/checkout')}
                      disabled={status === 'loading' || cartItems.length === 0}
                    >
                      Thanh Toán
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setShowModal(true)}
                      disabled={status === 'loading' || cartItems.length === 0}
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
