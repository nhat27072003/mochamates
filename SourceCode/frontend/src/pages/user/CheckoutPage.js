import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaMoneyBillWave, FaCreditCard, FaWallet } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart, fetchCart } from "../../redux/cartSlice";
import { formatPrice } from "../../utils/helpers";
import { checkOrderStatus, getOrderForUser, placeOrder } from "../../services/OrderService";
import { getOptionDisplayName, getOptionValueDisplay } from "../../utils/displayOption";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, status } = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cvv: "",
    ipAddress: "127.0.0.1", // Default for testing; get from client in production
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const qty = item.quantity || 1;
      return sum + (item.totalPrice || item.price || 0) * qty;
    }, 0);
  };

  const shipping = 10000;
  const discount = 0;
  const total = calculateSubtotal() + shipping - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        newErrors.fullName = !value ? "Họ và tên là bắt buộc" : "";
        break;
      case "phoneNumber":
        newErrors.phoneNumber = !/^\d{10}$/.test(value) ? "Số điện thoại không hợp lệ" : "";
        break;
      case "streetAddress":
        newErrors.streetAddress = !value ? "Địa chỉ đường phố là bắt buộc" : "";
        break;
      case "city":
        newErrors.city = !value ? "Thành phố là bắt buộc" : "";
        break;
      case "postalCode":
        newErrors.postalCode = !/^\d{5}$/.test(value) ? "Mã bưu điện không hợp lệ" : "";
        break;
      case "paymentMethod":
        newErrors.paymentMethod = !value ? "Vui lòng chọn phương thức thanh toán" : "";
        break;
      case "cardNumber":
        if (formData.paymentMethod === "card") {
          newErrors.cardNumber = !/^\d{16}$/.test(value) ? "Số thẻ không hợp lệ" : "";
        } else {
          newErrors.cardNumber = "";
        }
        break;
      case "cardExpiry":
        if (formData.paymentMethod === "card") {
          newErrors.cardExpiry = !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
            ? "Ngày hết hạn không hợp lệ (MM/YY)"
            : "";
        } else {
          newErrors.cardExpiry = "";
        }
        break;
      case "cvv":
        if (formData.paymentMethod === "card") {
          newErrors.cvv = !/^\d{3}$/.test(value) ? "CVV không hợp lệ" : "";
        } else {
          newErrors.cvv = "";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (!isFormValid()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await placeOrder(formData);
      if (result.statusCode === "1000" && result.data?.paymentUrl) {
        const paymentWindow = window.open(result.data.paymentUrl, "_blank", "width=600,height=800");
        dispatch(fetchCart());
        if (!paymentWindow) {
          toast.error("Vui lòng cho phép popup để tiếp tục thanh toán!");
          return;
        }

        const checkPaymentStatus = setInterval(async () => {
          if (paymentWindow.closed) {
            clearInterval(checkPaymentStatus);
            const orderId = result.data?.order?.id;
            const updatedOrder = await getOrderForUser(Number(orderId));
            console.log('check updateorder', updatedOrder);
            if (updatedOrder?.data?.status === "PAID") {
              toast.success("Thanh toán thành công!");
              dispatch(clearCart());
              navigate("/order");
            } else if (updatedOrder?.data.status === "FAILED") {
              toast.error("Thanh toán thất bại!");
            } else {
              toast.info("Thanh toán đang xử lý hoặc bị hủy!");
            }
            setIsLoading(false);
          }
        }, 500);
      } else {
        toast.success("Đặt hàng thành công!");
        await dispatch(fetchCart());
        navigate("/order");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Order placement error:", err);
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phoneNumber &&
      formData.streetAddress &&
      formData.city &&
      formData.paymentMethod &&
      (formData.paymentMethod !== "card" ||
        (formData.cardNumber && formData.cardExpiry && formData.cvv)) &&
      (formData.paymentMethod !== "VNPay" || formData.ipAddress) &&
      Object.values(errors).every((error) => !error)
    );
  };

  return (
    <div className="checkout-page min-vh-100 bg-light py-5">
      <div className="container-fluid">
        <h1 className="text-center mb-4">Thanh Toán</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="text-muted">Giỏ hàng của bạn đang trống</h2>
            <Link to="/" className="btn btn-primary mt-3">
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm p-4">
                <h2 className="h4 mb-4">Tóm Tắt Đơn Hàng</h2>
                <div className="mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3">
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/80?text=Product+Image"}
                        alt={item.name}
                        className="rounded me-3"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=Product+Image";
                        }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="fs-6 mb-1">{item.name}</h5>
                        <p className="text-muted small mb-0">
                          Số lượng: {item.quantity || 1}
                        </p>
                        {item.selectedOptions &&
                          Object.entries(item.selectedOptions).map(([optionName, values]) => (
                            <p key={optionName} className="text-muted small mb-0">
                              <strong>{getOptionDisplayName(optionName)}:</strong>{" "}
                              {values.map((value) => getOptionValueDisplay(optionName, value)).join(", ")}
                            </p>
                          ))}
                      </div>
                      <span className="fw-medium">
                        {formatPrice((item.totalPrice || item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mt-2 text-success">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-3 fw-bold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="col-lg-8">
              <div className="card shadow-sm p-4">
                <form onSubmit={handleSubmit}>
                  {/* Shipping Address */}
                  <h2 className="h4 mb-3">Thông Tin Giao Hàng</h2>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label htmlFor="fullName" className="form-label">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">{errors.fullName}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label htmlFor="phoneNumber" className="form-label">
                        Số Điện Thoại
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                      {errors.phoneNumber && (
                        <div className="invalid-feedback">{errors.phoneNumber}</div>
                      )}
                    </div>
                    <div className="col-12">
                      <label htmlFor="streetAddress" className="form-label">
                        Địa Chỉ Đường Phố
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.streetAddress ? "is-invalid" : ""}`}
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                      {errors.streetAddress && (
                        <div className="invalid-feedback">{errors.streetAddress}</div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="city" className="form-label">
                        Thành Phố
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.city ? "is-invalid" : ""}`}
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                      {errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="district" className="form-label">
                        Quận/Huyện
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="ward" className="form-label">
                        Phường/Xã
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="postalCode" className="form-label">
                        Mã Bưu Điện
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.postalCode ? "is-invalid" : ""}`}
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                      {errors.postalCode && (
                        <div className="invalid-feedback">{errors.postalCode}</div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <h2 className="h4 mb-4">Phương Thức Thanh Toán</h2>
                  <div className="mb-4">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        onChange={handleInputChange}
                        aria-label="Thanh toán khi nhận hàng"
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="cod">
                        <FaMoneyBillWave className="me-2 text-success" />
                        Thanh Toán Khi Nhận Hàng
                      </label>
                    </div>
                    {/* <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="card"
                        onChange={handleInputChange}
                        aria-label="Thẻ tín dụng/thẻ ghi nhận"
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="card">
                        <FaCreditCard className="me-2 text-primary" />
                        Thẻ Tín Dụng/Thẻ Ghi Nợ
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="wallet"
                        value="wallet"
                        onChange={handleInputChange}
                        aria-label="Ví điện tử"
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="wallet">
                        <FaWallet className="me-2 text-purple" />
                        Ví Điện Tử
                      </label>
                    </div> */}
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="VNPay"
                        value="VNPay"
                        onChange={handleInputChange}
                        aria-label="VNPay"
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="VNPay">
                        {/* <SiVnpay className="me-2 text-danger" /> */}
                        VNPay
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <div className="text-danger small mt-2">{errors.paymentMethod}</div>
                    )}
                  </div>

                  {/* Card Details (Conditional) */}
                  {formData.paymentMethod === "card" && (
                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <label htmlFor="cardNumber" className="form-label">
                          Số Thẻ
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          aria-required="true"
                        />
                        {errors.cardNumber && (
                          <div className="invalid-feedback">{errors.cardNumber}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cardExpiry" className="form-label">
                          Ngày Hết Hạn (MM/YY)
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardExpiry ? "is-invalid" : ""}`}
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          aria-required="true"
                        />
                        {errors.cardExpiry && (
                          <div className="invalid-feedback">{errors.cardExpiry}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          aria-required="true"
                        />
                        {errors.cvv && (
                          <div className="invalid-feedback">{errors.cvv}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={!isFormValid() || isLoading || status === "loading"}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt Hàng"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
