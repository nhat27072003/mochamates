import axiosClient from "./axiosClient"

const createComment = async (reviewData) => {
  const response = await axiosClient.post("/api/v1/reviews", reviewData);
  return response;
}
const hasReviewed = async (orderItemId, orderId, productId) => {
  const response = await axiosClient.get(`/api/v1/reviews/has-reviewed?orderItemId=${orderItemId}&orderId=${orderId}&productId=${productId}`)
  return response.data;
}
const getProductReview = async (productId) => {
  const response = await axiosClient.get(`/api/v1/reviews/product/${productId}`);
  return response.data;
}
export {
  createComment,
  hasReviewed,
  getProductReview
}