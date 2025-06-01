import React, { useState, useEffect } from "react";
import { FaUser, FaHeart, FaReply, FaCheck, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createComment, getProductReview } from "../services/ReviewService";

const Comment = ({ productId }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user); // Assuming user info is stored in Redux
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0); // For submitting a rating with the comment
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchComments();
  }, [productId, page]);

  const fetchComments = async () => {
    try {
      setLoading(page === 0);
      setLoadingMore(page > 0);
      const response = await getProductReview(productId, page, pageSize);
      console.log('check reveiw', response)
      const fetchedComments = response.reviews.map((review) => ({
        id: review.id,
        user: review.userId,
        username: review.username,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        comment: review.comment,
        rating: review.rating,
        timestamp: new Date(review.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        isAdmin: false,
        likes: 0,
        isVerified: true,
        replies: review.replies.map((reply) => ({
          id: reply.id,
          user: reply.adminId, // Replace with admin username if available
          comment: reply.reply,
          timestamp: new Date(reply.createdAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          isAdmin: true,
        })),
      }));
      setComments((prev) => (page === 0 ? fetchedComments : [...prev, ...fetchedComments]));
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Lỗi tải bình luận");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Bạn cần đăng nhập để bình luận");
      return;
    }
    if (newComment.trim().length === 0) {
      setError("Vui lòng nhập bình luận");
      return;
    }
    if (newComment.length > 500) {
      setError("Bình luận phải dưới 500 ký tự");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Vui lòng chọn đánh giá từ 1 đến 5 sao");
      return;
    }

    try {
      const reviewData = {
        productId: Number(productId),
        orderId: null, // Order ID might be required; handle this based on your app logic
        orderItemId: null, // Order item ID might be required
        rating: rating,
        comment: newComment,
      };
      const response = await createComment(reviewData);
      const newCommentObj = {
        id: response.data.id,
        user: user?.username || "Guest User", // Use actual username from Redux
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        comment: newComment,
        rating: rating,
        timestamp: new Date(response.data.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        isAdmin: false,
        likes: 0,
        isVerified: true,
        replies: [],
      };
      setComments((prev) => [newCommentObj, ...prev]); // Add new comment to the top
      setNewComment("");
      setRating(0);
      setError("");
      toast.success("Bình luận đã được đăng!");
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.response?.data?.message || "Lỗi khi đăng bình luận");
    }
  };

  const loadMoreComments = () => {
    if (page + 1 < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="product-comments container py-4" style={{ backgroundColor: "#FDF8F3" }}>
        <h2 className="text-3xl font-semibold text-primary-brown mb-4">Product Comments</h2>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-comments container py-4" style={{ backgroundColor: "#FDF8F3" }}>
      <h2 className="text-3xl font-semibold text-primary-brown mb-4">Product Comments</h2>

      {error && <div className="alert alert-danger small mb-4">{error}</div>}

      {comments.length === 0 ? (
        <p className="text-gray-600">Chưa có bình luận nào cho sản phẩm này.</p>
      ) : (
        <div className="row g-4">
          {comments.map((comment) => (
            <div key={comment.id} className="col-12">
              <div
                className={`card p-3 shadow-sm ${comment.isAdmin ? "bg-secondary-light" : "bg-white"
                  } ${comment.isAdmin ? "ms-4" : ""}`}
              >
                <div className="d-flex align-items-start">
                  <img
                    src={comment.avatar}
                    alt={comment.user}
                    className="rounded-circle object-fit-cover"
                    style={{ width: "48px", height: "48px" }}
                    onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde")
                    }
                  />
                  <div className="ms-3 flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold text-primary-brown">{comment.username}</span>
                      {comment.isVerified && (
                        <FaCheck className="text-primary-green" title="Verified Purchase" />
                      )}
                      {comment.isAdmin && (
                        <span className="badge bg-primary-green text-white">Admin</span>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < comment.rating ? "text-warning" : "text-muted"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2">{comment.comment}</p>
                    <div className="d-flex gap-3 mt-2 text-gray-800 text-sm">
                      <span>{comment.timestamp}</span>
                      <button className="btn btn-link p-0 text-gray-800 hover-text-primary-brown d-flex align-items-center gap-1">
                        <FaHeart />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="btn btn-link p-0 text-gray-800 hover-text-primary-brown d-flex align-items-center gap-1">
                        <FaReply />
                        <span>Reply</span>
                      </button>
                    </div>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="ms-4 mt-2">
                            <div className="d-flex align-items-start">
                              <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                                alt={reply.user}
                                className="rounded-circle object-fit-cover"
                                style={{ width: "32px", height: "32px" }}
                              />
                              <div className="ms-3 flex-grow-1">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="fw-bold text-primary-brown">
                                    {reply.user}
                                  </span>
                                  <span className="badge bg-primary-green text-white">
                                    Admin
                                  </span>
                                </div>
                                <p className="text-gray-600 mt-1">{reply.comment}</p>
                                <span className="text-gray-800 text-sm">
                                  {reply.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {page + 1 < totalPages && (
        <button
          onClick={loadMoreComments}
          className="btn w-100 mt-4 py-2 bg-primary-brown text-white rounded-pill hover-bg-primary-dark disabled-opacity-50"
          disabled={loadingMore}
        >
          {loadingMore ? "Đang tải..." : "Tải Thêm Bình Luận"}
        </button>
      )}

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-3">
          <label className="form-label small">Đánh Giá:</label>
          <div className="d-flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                className={star <= rating ? "text-warning" : "text-muted"}
                onClick={() => setRating(star)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
        <div className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setError("");
            }}
            placeholder="Chia sẻ ý kiến của bạn về sản phẩm này..."
            className="form-control p-3 border border-gray-300 rounded-lg focus-ring-primary-green focus-border-transparent min-h-[120px]"
            maxLength={500}
          />
          {error && <p className="text-danger small mt-1">{error}</p>}
          <p className="text-gray-800 small mt-1">
            {newComment.length}/500 ký tự
          </p>
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || rating < 1}
          className="btn w-100 py-2 bg-primary-green text-white rounded-pill hover-bg-secondary-dark disabled-opacity-50 disabled-cursor-not-allowed"
        >
          Đăng Bình Luận
        </button>
      </form>
    </div>
  );
};

export default Comment;