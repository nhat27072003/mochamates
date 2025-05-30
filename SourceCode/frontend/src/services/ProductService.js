import axios from "axios";
import axiosClient from "./axiosClient"
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL;
const CLOUDINARY_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

const uploadImage = async (file) => {
  try {
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG)');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Tệp ảnh quá lớn (tối đa 10MB)');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', 'products');
    console.log('come here', CLOUDINARY_URL)
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response?.data?.secure_url;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message || 'Lỗi khi tải ảnh lên Cloudinary');
  }
};

const fetchProducts = async (type = null, page = 0, size = 6) => {
  try {
    const params = { page, size };
    if (type) params.type = type;
    const response = await axiosClient.get(`/api/v1/products`, { params });
    if (response.statusCode !== '1000') {
      throw new Error(response.message || 'Failed to fetch products');
    }
    return response.data;
  } catch (error) {

    throw new Error(error.response?.data?.message || 'Error fetching products');
  }
};
const getProductById = async (id) => {
  const response = await axiosClient.get(`/api/v1/products/${id}`);
  console.log(response);
  return response.data;
}
const fetchNewestProducts = async (page = 0, size = 6) => {
  try {

    const params = { page, size };
    const response = await axiosClient.get(`/api/v1/products/newest`, { params });
    console.log('check get newest product', response);
    if (response.statusCode !== '1000') {
      throw new Error(response.message || 'Failed to fetch products');
    }
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error(error.response?.data?.message || 'Error fetching products');
  }
}
const createProduct = async (data) => {
  console.log('check add data product', data);
  const response = await axiosClient.post('/api/v1/admin/products', data);
  return response;
}
const updateProduct = async (id, data) => {
  const response = await axiosClient.put(`/api/v1/admin/products/${id}`, data);
  return response;
}
const fetchProductsForAdmin = async (page, size) => {
  const response = await axiosClient.get(`/api/v1/admin/products?page=${page}&size=${size}`);
  console.log(response);
  return response.data;

};
const fetchProductById = async (id) => {
  const response = await axiosClient.get(`/api/v1/admin/products/${id}`);
  console.log(response);
  return response.data;
}


const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/api/v1/admin/products/${id}`);
  return response;
}
export {
  fetchProducts,
  fetchNewestProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadImage,
  fetchProductsForAdmin,
  fetchProductById,
  deleteProduct
}