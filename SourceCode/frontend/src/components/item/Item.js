import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { addToCart, fetchCart } from "../../redux/cartSlice";
import { formatPrice } from "../../utils/helpers";
import { toast } from "react-toastify";

const Item = ({ id, name, imageUrl, price, rating = 4.5, description, badge = "New", options = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!isAuthenticated) {
        navigate("/signin");
        return;
      }

      // Tạo selectedOptions với giá trị mặc định từ options
      const selectedOptions = options.reduce((acc, option) => {
        if (option && option.name && Array.isArray(option.values) && option.values.length > 0) {
          acc[option.name] = option.values[0].value || ""; // Chọn giá trị đầu tiên
        }
        return acc;
      }, {});

      const cartItem = {
        productId: id,
        name: name,
        price: price,
        imageUrl: imageUrl,
        selectedOptions: Object.keys(selectedOptions).reduce((acc, optionName) => {
          if (selectedOptions[optionName]) {
            acc[optionName] = [selectedOptions[optionName]]; // Định dạng theo yêu cầu API
          }
          return acc;
        }, {}),
        quantity: 1,
      };

      console.log("Adding to cart:", cartItem);
      await dispatch(addToCart(cartItem)).unwrap();
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      dispatch(fetchCart());
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
  };

  return (
    <Link to={`/products/${id}`} className="item-card-link text-decoration-none">
      <div className="card item-product-card h-100 position-relative">
        <span
          className={`badge ${badge === "New" ? "bg-danger" : "bg-success"} position-absolute top-0 end-0 m-2`}
        >
          {badge}
        </span>
        <img
          src={imageUrl || ""}
          className="card-img-top object-fit-cover"
          alt={name}
          style={{ height: "200px" }}
          loading="lazy"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fs-6 fw-bold mb-1">{name}</h5>
          <div className="d-flex align-items-center mb-2">
            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
              <AiFillStar key={i} className="text-warning" size={16} />
            ))}
            {rating % 1 !== 0 && <BsStarHalf className="text-warning" size={16} />}
            <small className="text-muted ms-1">({rating}/5)</small>
          </div>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">{formatPrice(price)}</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Item;