export const formatPrice = (price) => {
  return Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};