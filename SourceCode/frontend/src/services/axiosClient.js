import axios from 'axios';
import { logout, refreshToken } from '../redux/userSlice';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let getStore = null;
export const setStore = (storeFn) => {
  getStore = storeFn;
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 401 (token hết hạn)
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     if (!getStore) {
    //       throw new Error('Store not initialized');
    //     }
    //     const store = getStore();
    //     const result = await store.dispatch(refreshToken()).unwrap();
    //     const newToken = result.accessToken;

    //     // Cập nhật localStorage
    //     localStorage.setItem('accessToken', newToken);
    //     localStorage.setItem('user', JSON.stringify({
    //       userId: result.userId,
    //       username: result.userId.toString(),
    //       role: result.role,
    //     }));

    //     // Cập nhật header
    //     originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //     return axiosClient(originalRequest);
    //   } catch (refreshErr) {
    //     console.error('Refresh token failed:', refreshErr);
    //     if (getStore) {
    //       getStore().dispatch(logout());
    //     }
    //     return Promise.reject(error);
    //   }
    // }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!getStore) {
          throw new Error('Store not initialized');
        }
        const store = getStore();
        const result = await store.dispatch(refreshToken()).unwrap();
        const newToken = result.accessToken;
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify({
          userId: result.userId,
          username: result.userId.toString(),
          role: result.role,
        }));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);
        if (getStore) {
          getStore().dispatch(logout());
        }
        return Promise.reject(error);
      }
    }

    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
