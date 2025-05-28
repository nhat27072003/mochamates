import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";

const ProductReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const dummyProduct = {
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    orderNumber: "ORD-2024-0123",
    purchaseDate: "2024-01-15",
  };

  const handleCommentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setComment(text);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setSelectedImage(null);
      setIsAnonymous(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = rating > 0 && comment.trim().length >= 10;

  return (
    <div className="product-review-form container py-5 bg-background-light">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "32rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-brown">Write a Review</h2>
          <button className="btn p-0 text-gray-600 hover-text-primary-brown" aria-label="Close form">
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <img
            src={dummyProduct.image}
            alt={dummyProduct.name}
            className="rounded-lg object-cover"
            style={{ width: "80px", height: "80px" }}
            onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e")}
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{dummyProduct.name}</h3>
            <p className="text-sm text-gray-600">Order #{dummyProduct.orderNumber}</p>
            <p className="text-sm text-gray-600">Purchased on {dummyProduct.purchaseDate}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-gray-700 fw-medium">Rating</label>
            <div className="d-flex gap-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className="focus:outline-none"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${ratingValue} stars`}
                  >
                    <FaStar
                      className={`w-8 h-8 transition-colors ${(hover || rating) >= ratingValue ? "text-accent-orange" : "text-gray-300"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-gray-700 fw-medium">
              Your Review
              <span className="float-end text-gray-600">
                {comment.length}/500
              </span>
            </label>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Share your experience with this product..."
              className="form-control p-3 rounded-lg focus-ring-primary-green focus-border-transparent"
              style={{ height: "120px" }}
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-gray-700 fw-medium">
              Add Photos (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control p-2 rounded-lg"
            />
            {selectedImage && (
              <div className="mt-2">
                <img
                  src={selectedImage}
                  alt="Review preview"
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="mb-4 d-flex align-items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="form-check-input h-4 w-4 text-primary-green focus-ring-primary-green border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="form-check-label text-sm text-gray-700">
              Post anonymously
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`btn w-100 py-2 text-white rounded-pill transition-colors ${isFormValid && !isSubmitting
                ? "bg-primary-green hover-bg-primary-dark"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ProductReviewForm;