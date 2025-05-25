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

const createProduct = async (data) => {
  console.log('check add data product', data);
  const response = await axiosClient.post('/api/v1/admin/products', data);
  return response;
}
const updateProduct = async (id, data) => {
  const response = await axiosClient.put(`/api/v1/admin/products/${id}`, data);
  return response;
}
const fetchProducts = async (page, size) => {
  const response = await axiosClient.get(`/api/v1/admin/products?page=${page}&size=${size}`);
  console.log(response);
  return response.data;

};
const fetchProductById = async (id) => {
  const response = await axiosClient.get(`api/v1/admin/products/${id}`);
  console.log(response);
  return response.data;
}


const deleteProduct = async () => {

}
export {
  createProduct,
  updateProduct,
  uploadImage,
  fetchProducts,
  fetchProductById,
  deleteProduct
}