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
const updateProduct = async (data) => {
  const response = await axiosClient.put('/api/v1/admin/products', data);
  return response;
}
const fetchProductById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'PROD001',
        name: 'Latte Mochamates',
        description: 'Creamy latte',
        price: 30000,
        imageUrl: 'http://example.com/latte.jpg',
        updateAt: '2025-05-23T14:53:00',
        type: 'READY_TO_DRINK_COFFEE',
        specificAttributes: {
          drinkType: 'Latte',
          preparationTime: 5,
          ingredients: 'Espresso, Milk',
        },
        options: [
          {
            name: 'Size',
            type: 'DROPDOWN',
            values: [
              { id: 1, value: 'Small', additionalPrice: 0 },
              { id: 2, value: 'Large', additionalPrice: 10000 },
              { id: 3, value: 'Medium', additionalPrice: 10000 }, // Fixed duplicate ID
            ],
          },
        ],
      });
    }, 500);
  });
};


export {
  fetchProductById,
  createProduct,
  updateProduct,
  uploadImage
}