import React, { useState } from "react";
import { FaUser, FaHeart, FaReply, FaCheck } from "react-icons/fa";

const Comment = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      comment: "This coffee maker is absolutely amazing! The temperature control is perfect, and it makes the smoothest brew I've ever tasted.",
      timestamp: "2 hours ago",
      isAdmin: false,
      likes: 12,
      isVerified: true,
    },
    {
      id: 2,
      user: "Coffee Expert",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      comment: "Thank you for your feedback! We're glad you're enjoying the precise temperature control feature. It's indeed designed to extract the perfect flavor.",
      timestamp: "1 hour ago",
      isAdmin: true,
      likes: 8,
      isVerified: true,
    },
    {
      id: 3,
      user: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      comment: "The build quality is exceptional. Worth every penny!",
      timestamp: "3 hours ago",
      isAdmin: false,
      likes: 5,
      isVerified: true,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim().length === 0) {
      setError("Please enter a comment");
      return;
    }
    if (newComment.length > 500) {
      setError("Comment must be less than 500 characters");
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      user: "Guest User",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      comment: newComment,
      timestamp: "Just now",
      isAdmin: false,
      likes: 0,
      isVerified: false,
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
    setError("");
  };

  const loadMoreComments = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Add more comments logic here (e.g., API call)
    }, 1000);
  };

  return (
    <div className="product-comments container py-4" style={{ backgroundColor: "#FDF8F3" }}>
      <h2 className="text-3xl font-semibold text-primary-brown mb-4">Product Comments</h2>

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
                  onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde")}
                />
                <div className="ms-3 flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-primary-brown">{comment.user}</span>
                    {comment.isVerified && (
                      <FaCheck className="text-primary-green" title="Verified Purchase" />
                    )}
                    {comment.isAdmin && (
                      <span className="badge bg-primary-green text-white">Admin</span>
                    )}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={loadMoreComments}
        className="btn w-100 mt-4 py-2 bg-primary-brown text-white rounded-pill hover-bg-primary-dark disabled-opacity-50"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More Comments"}
      </button>

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setError("");
            }}
            placeholder="Share your thoughts about this product..."
            className="form-control p-3 border border-gray-300 rounded-lg focus-ring-primary-green focus-border-transparent min-h-[120px]"
            maxLength={500}
          />
          {error && <p className="text-danger small mt-1">{error}</p>}
          <p className="text-gray-800 small mt-1">
            {newComment.length}/500 characters
          </p>
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="btn w-100 py-2 bg-primary-green text-white rounded-pill hover-bg-secondary-dark disabled-opacity-50 disabled-cursor-not-allowed"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default Comment;