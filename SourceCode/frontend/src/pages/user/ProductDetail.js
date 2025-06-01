import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../redux/cartSlice";
import Comment from "../../components/Comment";
import { toast } from "react-toastify";
import { getProductById } from "../../services/ProductService";

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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300?text=Product+Image";

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
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        if (!data || !data.id) {
          throw new Error("Invalid product data");
        }
        setProduct({
          ...data,
          price: data.price ? data.price.toString() : "0",
          imageUrl: data.imageUrl || PLACEHOLDER_IMAGE,
          specificAttributesDTO: {
            origin: data.specificAttributesDTO?.origin || "",
            roastDate: data.specificAttributesDTO?.roastDate || "",
            composition: data.specificAttributesDTO?.composition || "",
            packType: data.specificAttributesDTO?.packType || "",
            instructions: data.specificAttributesDTO?.instructions || "",
            expireDate: data.specificAttributesDTO?.expireDate || "",
          },
          options: Array.isArray(data.options)
            ? data.options.map((opt) => ({
              ...opt,
              values: Array.isArray(opt.values) ? opt.values : [],
            }))
            : [],
        });
        setSelectedOptions(
          (Array.isArray(data.options) ? data.options : []).reduce((acc, option) => {
            if (option && option.name && option.values.length > 0) {
              acc[option.name] = option.values[0].value || "";
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
      dispatch(fetchCart());
    }
  }, [id, isAuthenticated, dispatch]);

  const cartItem = cartItems.find((item) => item.productId === Number(id));

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("http")) {
      return PLACEHOLDER_IMAGE;
    }
    return `${imageUrl}?w=300&h=300&c=fill`;
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case "READY_TO_DRINK_COFFEE":
        return "Cà phê pha sẵn";
      case "ROASTED_COFFEE":
        return "Cà phê hạt/xay";
      case "INSTANT_COFFEE":
        return "Cà phê hòa tan";
      default:
        return type || "Không xác định";
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
    setValidationError(null);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = Number(product.price) || 0;
    (product.options || []).forEach((option) => {
      if (!option || !option.name) return;
      const selectedValue = selectedOptions[option.name];
      if (selectedValue) {
        const value = option.values.find((val) => val.value === selectedValue);
        if (value) total += value.additionalPrice || 0;
      }
    });
    return total;
  };

  const validateOptions = () => {
    const requiredOptions = [
      "IceLevel",
      "SugarLevel",
      "SizeOption",
      "RoastLevel",
      "GrindLevel",
      "Weight",
    ];
    for (const option of product.options || []) {
      if (!option || !option.name) continue;
      if (requiredOptions.includes(option.name) && !selectedOptions[option.name]) {
        const displayName =
          labelMap[option.name] && Object.values(labelMap[option.name])[0]
            ? option.name.replace(/([A-Z])/g, " $1").trim()
            : option.name;
        return `Vui lòng chọn ${displayName.toLowerCase()}`;
      }
    }
    return null;
  };

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        toast.info("Bạn chưa đăng nhập");
        return;
      }
      const optionError = validateOptions();
      if (optionError) {
        setValidationError(optionError);
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
        selectedOptions: Object.keys(selectedOptions).reduce((acc, optionName) => {
          if (selectedOptions[optionName]) {
            acc[optionName] = [selectedOptions[optionName]];
          }
          return acc;
        }, {}),
        quantity,
      };
      await dispatch(addToCart(cartItem)).unwrap();
      toast.success("Đã thêm vào giỏ hàng!");
      dispatch(fetchCart());
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err.message || "Lỗi khi thêm vào giỏ hàng");
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
                <div className="type-specific-section mt-3">
                  <h6 className="section-title">Chi Tiết</h6>
                  {product.type === "ROASTED_COFFEE" && (
                    <>
                      {product.specificAttributesDTO.origin && (
                        <p>
                          <strong>Nguồn Gốc:</strong> {product.specificAttributesDTO.origin}
                        </p>
                      )}
                      {product.specificAttributesDTO.roastDate && (
                        <p>
                          <strong>Ngày Rang:</strong>{" "}
                          {new Date(product.specificAttributesDTO.roastDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      )}
                      {product.specificAttributesDTO.composition && (
                        <p>
                          <strong>Thành Phần:</strong> {product.specificAttributesDTO.composition}
                        </p>
                      )}
                    </>
                  )}
                  {product.type === "INSTANT_COFFEE" && (
                    <>
                      {product.specificAttributesDTO.packType && (
                        <p>
                          <strong>Loại Bao Bì:</strong> {product.specificAttributesDTO.packType}
                        </p>
                      )}
                      {product.specificAttributesDTO.expireDate && (
                        <p>
                          <strong>Hạn Sử Dụng:</strong>{" "}
                          {new Date(product.specificAttributesDTO.expireDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      )}
                      {product.specificAttributesDTO.instructions && (
                        <p>
                          <strong>Hướng Dẫn:</strong> {product.specificAttributesDTO.instructions}
                        </p>
                      )}
                    </>
                  )}
                  <p>
                    <strong>Mô Tả:</strong> {product.description || "Không có mô tả"}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="section-title">Thông Tin Sản Phẩm</h6>
                <p>
                  <strong>Tên sản phẩm:</strong> {product.name || "Không xác định"}
                </p>
                <p>
                  <strong>Danh Mục:</strong> {getTypeDisplay(product.type)}
                </p>
                {product.options.length > 0 && (
                  <div className="attribute-section mt-3">
                    <h6 className="section-title">Tùy Chọn Thuộc Tính</h6>
                    {product.options.map((option, index) => (
                      <div key={option.name || `option-${index}`} className="mb-2">
                        <label className="form-label small">
                          {(labelMap[option.name] &&
                            Object.values(labelMap[option.name])[0] &&
                            option.name.replace(/([A-Z])/g, " $1").trim()) ||
                            option.name}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="attribute-buttons">
                          {option.values.map((value) => (
                            <button
                              key={value.value}
                              type="button"
                              className={`attribute-button ${selectedOptions[option.name] === value.value ? "selected" : ""
                                }`}
                              onClick={() => handleOptionChange(option.name, value.value)}
                            >
                              {(labelMap[option.name] && labelMap[option.name][value.value]) ||
                                value.value}{" "}
                            </button>
                          ))}
                        </div>
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
                  <h5 className="price-text">
                    Tổng: {formatPrice(calculateTotalPrice() * quantity)}
                  </h5>
                </div>
                <button
                  className="btn btn-custom mt-2 text-white"
                  onClick={handleAddToCart}
                  disabled={loading || cartStatus === "loading"}
                >
                  {cartStatus === "loading" ? "Đang xử lý..." : "Thêm vào Giỏ Hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Comment productId={id} />
    </div>
  );
};

export default ProductDetail;
