import axiosClient from "./axiosClient"

const getOrdersForUser = async () => {
  const response = await axiosClient.get('/api/v1/orders');
  console.log('check get order', response);
  return response;
}

export {
  getOrdersForUser
}