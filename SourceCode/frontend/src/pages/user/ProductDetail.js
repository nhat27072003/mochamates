import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProdutById } from "../../services/ProductService"; // Typo: should be getProductById
import { addToCart, updateCartItem, fetchCart } from "../../redux/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1); // Added quantity state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300?text=Product+Image";

  // Fetch product and cart on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProdutById(id); // Fix typo in service name if needed
        if (!data || !data.id) {
          throw new Error("Invalid product data");
        }
        setProduct({
          ...data,
          price: data.price ? data.price.toString() : "0",
          imageUrl: data.imageUrl || PLACEHOLDER_IMAGE,
          specificAttributesDTO: {
            drinkType: data.specificAttributesDTO?.drinkType || "",
            ingredients: data.specificAttributesDTO?.ingredients || "",
            preparationTime: data.specificAttributesDTO?.preparationTime?.toString() || "",
            roastLevel: data.specificAttributesDTO?.roastLevel || "",
            origin: data.specificAttributesDTO?.origin || "",
            roastDate: data.specificAttributesDTO?.roastDate || "",
            packType: data.specificAttributesDTO?.packType || "",
            instructions: data.specificAttributesDTO?.instructions || "",
            expireDate: data.specificAttributesDTO?.expireDate || "",
          },
          options: Array.isArray(data.options) ? data.options : [],
        });
        setSelectedOptions(
          (Array.isArray(data.options) ? data.options : []).reduce((acc, option) => {
            if (option && option.id) {
              acc[option.id] = option.type === "CHECKBOX" ? [] : "";
            }
            return acc;
          }, {})
        );
      } catch (err) {
        setError("Lỗi tải thông tin sản phẩm");
        console.error("Load product error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    if (isAuthenticated) {
      dispatch(fetchCart()); // Fetch cart to check if product is already in cart
    }
  }, [id, isAuthenticated, dispatch]);

  // Check if product is in cart
  const cartItem = cartItems.find((item) => item.productId === Number(id));

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("http")) {
      return PLACEHOLDER_IMAGE;
    }
    return `${imageUrl}?w=300&h=300&c=fill`;
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case "READY_TO_DRINK_COFFEE": return "Cà phê pha sẵn";
      case "GROUND_COFFEE": return "Cà phê hạt/xay";
      case "PACKAGED_COFFEE": return "Cà phê đóng gói";
      default: return type || "Không xác định";
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const handleOptionChange = (optionId, valueId, type) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };
      if (type === "CHECKBOX") {
        const current = Array.isArray(prev[optionId]) ? prev[optionId] : [];
        newOptions[optionId] = current.includes(valueId)
          ? current.filter((id) => id !== valueId)
          : [...current, valueId];
      } else {
        newOptions[optionId] = valueId;
      }
      return newOptions;
    });
    setValidationError(null);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = Number(product.price) || 0;
    (product.options || []).forEach((option) => {
      if (!option || !option.id) return;
      if (option.type === "CHECKBOX") {
        const selected = Array.isArray(selectedOptions[option.id]) ? selectedOptions[option.id] : [];
        selected.forEach((valueId) => {
          const value = option.values?.find((val) => val && val.id === valueId);
          if (value) total += value.additionalPrice || 0;
        });
      } else {
        const valueId = selectedOptions[option.id];
        if (valueId) {
          const value = option.values?.find((val) => val && val.id === valueId);
          if (value) total += value.additionalPrice || 0;
        }
      }
    });
    return total;
  };

  const validateOptions = () => {
    for (const option of product.options || []) {
      if (!option || !option.id) continue;
      if (option.isRequired) {
        const selected = selectedOptions[option.id];
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
          return `Vui lòng chọn ${option.name}`;
        }
      }
    }
    return null;
  };

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/signin");
        return;
      }
      const error = validateOptions();
      if (error) {
        setValidationError(error);
        return;
      }
      if (quantity < 1) {
        setValidationError("Số lượng phải lớn hơn 0");
        return;
      }

      const cartItem = {
        productId: Number(product.id),
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        selectedOptions: Object.entries(selectedOptions)
          .filter(([_, valueIds]) => valueIds && (Array.isArray(valueIds) ? valueIds.length > 0 : valueIds))
          .map(([optionId, valueIds]) => ({
            id: Number(optionId),
            name: product.options.find((opt) => opt.id === Number(optionId))?.name || "Option",
            type: product.options.find((opt) => opt.id === Number(optionId))?.type === "CHECKBOX" ? "checkbox" : "select",
            isRequired: product.options.find((opt) => opt.id === Number(optionId))?.isRequired || false,
            values: Array.isArray(valueIds)
              ? valueIds.map((valueId) => {
                const opt = product.options.find((opt) => opt.id === Number(optionId));
                const val = opt?.values.find((v) => v.id === valueId);
                return {
                  id: valueId,
                  value: val?.value || "",
                  additionalPrice: val?.additionalPrice || 0,
                };
              })
              : (() => {
                const opt = product.options.find((opt) => opt.id === Number(optionId));
                const val = opt?.values.find((v) => v.id === valueIds);
                return [
                  {
                    id: valueIds,
                    value: val?.value || "",
                    additionalPrice: val?.additionalPrice || 0,
                  },
                ];
              })(),
          })),
        quantity,
      };

      console.log("Adding to cart:", cartItem);
      await dispatch(addToCart(cartItem)).unwrap();
      alert("Đã thêm vào giỏ hàng!");
      dispatch(fetchCart()); // Refresh cart
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleUpdateCartItem = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/signin");
        return;
      }
      const error = validateOptions();
      if (error) {
        setValidationError(error);
        return;
      }
      if (quantity < 1) {
        setValidationError("Số lượng phải lớn hơn 0");
        return;
      }

      const updatePayload = {
        selectedOptions: Object.entries(selectedOptions)
          .filter(([_, valueIds]) => valueIds && (Array.isArray(valueIds) ? valueIds.length > 0 : valueIds))
          .map(([optionId, valueIds]) => ({
            id: Number(optionId),
            name: product.options.find((opt) => opt.id === Number(optionId))?.name || "Option",
            type: product.options.find((opt) => opt.id === Number(optionId))?.type === "CHECKBOX" ? "checkbox" : "select",
            isRequired: product.options.find((opt) => opt.id === Number(optionId))?.isRequired || false,
            values: Array.isArray(valueIds)
              ? valueIds.map((valueId) => {
                const opt = product.options.find((opt) => opt.id === Number(optionId));
                const val = opt?.values.find((v) => v.id === valueId);
                return {
                  id: valueId,
                  value: val?.value || "",
                  additionalPrice: val?.additionalPrice || 0,
                };
              })
              : (() => {
                const opt = product.options.find((opt) => opt.id === Number(optionId));
                const val = opt?.values.find((v) => v.id === valueIds);
                return [
                  {
                    id: valueIds,
                    value: val?.value || "",
                    additionalPrice: val?.additionalPrice || 0,
                  },
                ];
              })(),
          })),
        quantity,
      };

      console.log("Updating cart item:", updatePayload);
      await dispatch(updateCartItem({ productId: Number(product.id), updates: updatePayload })).unwrap();
      alert("Đã cập nhật giỏ hàng!");
      dispatch(fetchCart()); // Refresh cart
    } catch (err) {
      console.error("Error updating cart:", err);
      setError(err.message || "Lỗi khi cập nhật giỏ hàng");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page p-3">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page p-3">
        <div className="container">
          <div className="alert alert-danger small">{error || "Không tìm thấy sản phẩm"}</div>
          <button className="btn btn-outline-secondary btn-sm btn-back" onClick={() => navigate(-1)}>
            Quay Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page p-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button className="btn btn-outline-secondary btn-sm btn-back" onClick={() => navigate(-1)}>
            Quay Lại
          </button>
          <h5 className="page-title mx-auto">{product.name || "Sản phẩm không xác định"}</h5>
        </div>
        {error && <div className="alert alert-danger small">{error}</div>}
        {validationError && <div className="alert alert-warning small">{validationError}</div>}
        {cartError && <div className="alert alert-danger small">{cartError}</div>}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name || "Sản phẩm"}
                  className="product-image img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
                {product.type === "READY_TO_DRINK_COFFEE" && (
                  <div className="type-specific-section mt-3">
                    <h6 className="section-title">Chi Tiết</h6>
                    {product.specificAttributesDTO.drinkType && (
                      <p><strong>Loại Đồ Uống:</strong> {product.specificAttributesDTO.drinkType}</p>
                    )}
                    {product.specificAttributesDTO.preparationTime && (
                      <p><strong>Thời Gian Pha:</strong> {product.specificAttributesDTO.preparationTime} phút</p>
                    )}
                    {product.specificAttributesDTO.ingredients && (
                      <p><strong>Thành Phần:</strong> {product.specificAttributesDTO.ingredients}</p>
                    )}
                  </div>
                )}
                {product.type === "GROUND_COFFEE" && (
                  <div className="type-specific-section mt-3">
                    <h6 className="section-title">Chi Tiết</h6>
                    {product.specificAttributesDTO.roastLevel && (
                      <p><strong>Mức Độ Rang:</strong> {product.specificAttributesDTO.roastLevel}</p>
                    )}
                    {product.specificAttributesDTO.origin && (
                      <p><strong>Nguồn Gốc:</strong> {product.specificAttributesDTO.origin}</p>
                    )}
                    {product.specificAttributesDTO.roastDate && (
                      <p><strong>Ngày Rang:</strong> {new Date(product.specificAttributesDTO.roastDate).toLocaleDateString("vi-VN")}</p>
                    )}
                  </div>
                )}
                {product.type === "PACKAGED_COFFEE" && (
                  <div className="type-specific-section mt-3">
                    <h6 className="section-title">Chi Tiết</h6>
                    {product.specificAttributesDTO.packType && (
                      <p><strong>Loại Bao Bì:</strong> {product.specificAttributesDTO.packType}</p>
                    )}
                    {product.specificAttributesDTO.expireDate && (
                      <p><strong>Hạn Sử Dụng:</strong> {new Date(product.specificAttributesDTO.expireDate).toLocaleDateString("vi-VN")}</p>
                    )}
                    {product.specificAttributesDTO.instructions && (
                      <p><strong>Hướng Dẫn:</strong> {product.specificAttributesDTO.instructions}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <h6 className="section-title">Thông Tin Sản Phẩm</h6>
                <p><strong>Tên sản phẩm:</strong> {product.name || "Không xác định"}</p>
                <p><strong>Danh Mục:</strong> {getTypeDisplay(product.type)}</p>
                <p><strong>Mô Tả:</strong> {product.description || "Không có mô tả"}</p>

                {product.options.length > 0 && (
                  <div className="option-section mt-3">
                    <h6 className="section-title">Tùy Chọn</h6>
                    {product.options.map((option, index) => (
                      <div
                        key={option.id || `option-${index}`}
                        className="option-section border p-2 mb-2 rounded"
                      >
                        <label className="form-label small">
                          {option.name || "Tùy chọn"} {option.isRequired && <span className="text-danger">*</span>}
                        </label>
                        {option.type === "CHECKBOX" && (
                          <div className="checkbox-group ms-2">
                            {(option.values || []).map((val) => (
                              <div key={val.id} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`option-${option.id}-${val.id}`}
                                  checked={(selectedOptions[option.id] || []).includes(val.id)}
                                  onChange={() => handleOptionChange(option.id, val.id, "CHECKBOX")}
                                />
                                <label
                                  className="form-check-label small"
                                  htmlFor={`option-${option.id}-${val.id}`}
                                >
                                  {val.value || "Không xác định"} {val.additionalPrice > 0 ? `(+${formatPrice(val.additionalPrice)})` : ""}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {option.type === "DROPDOWN" && (
                          <select
                            className="form-select form-select-sm"
                            value={selectedOptions[option.id] || ""}
                            onChange={(e) => handleOptionChange(option.id, e.target.value, "DROPDOWN")}
                            required={option.isRequired}
                          >
                            <option value="">Chọn {option.name || "tùy chọn"}</option>
                            {(option.values || []).map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.value || "Không xác định"} {val.additionalPrice > 0 ? `(+${formatPrice(val.additionalPrice)})` : ""}
                              </option>
                            ))}
                          </select>
                        )}
                        {option.type === "RADIO" && (
                          <div className="radio-group ms-2">
                            {(option.values || []).map((val) => (
                              <div key={val.id} className="form-check">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  id={`option-${option.id}-${val.id}`}
                                  name={`option-${option.id}`}
                                  value={val.id}
                                  checked={selectedOptions[option.id] === val.id}
                                  onChange={() => handleOptionChange(option.id, val.id, "RADIO")}
                                  required={option.isRequired}
                                />
                                <label
                                  className="form-check-label small"
                                  htmlFor={`option-${option.id}-${val.id}`}
                                >
                                  {val.value || "Không xác định"} {val.additionalPrice > 0 ? `(+${formatPrice(val.additionalPrice)})` : ""}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="quantity-section mt-3">
                  <label className="form-label small">Số lượng:</label>
                  <input
                    type="number"
                    className="form-control form-control-sm w-25"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value) || 1);
                      setValidationError(null);
                    }}
                  />
                </div>

                <div className="total-price mt-3">
                  <h5 className="price-text">Tổng: {formatPrice(calculateTotalPrice() * quantity)}</h5>
                </div>
                <button
                  className="btn btn-custom mt-2 text-white"
                  onClick={cartItem ? handleUpdateCartItem : handleAddToCart}
                  disabled={loading || cartStatus === "loading"}
                >
                  {cartStatus === "loading"
                    ? "Đang xử lý..."
                    : cartItem
                      ? "Cập nhật Giỏ Hàng"
                      : "Thêm vào Giỏ Hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;