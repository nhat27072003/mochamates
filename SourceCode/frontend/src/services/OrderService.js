import axiosClient from "./axiosClient"

const getOrdersForUser = async () => {
  const response = await axiosClient.get('/api/v1/orders');
  console.log('check get order', response);
  return response;
}
const placeOrder = async (data) => {
  const response = await axiosClient.post('/api/v1/orders', data);
  return response;
}
const getAllOrders = async (data) => {
  const response = await axiosClient.get('/api/v1/admin/orders', { data });
  return response;
}
const getOrder = async (id) => {
  const response = await axiosClient.get(`/api/v1/admin/orders/${id}`);
  return response;
}
const getOrderForUser = async (id) => {
  const response = await axiosClient.get(`/api/v1/orders/${id}`);
  return response;
}

const updateOrderStatusForAdmin = async (orderId, status) => {
  const response = await axiosClient.put(`/api/v1/admin/orders/${orderId}/status`, status);
  return response;
}
const updateOrderStatus = async (orderId, status) => {
  const response = await axiosClient.put(`/api/v1/orders/${orderId}/status`, status)
  return response;
}
export {
  getOrdersForUser,
  placeOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updateOrderStatusForAdmin,
  getOrderForUser
}