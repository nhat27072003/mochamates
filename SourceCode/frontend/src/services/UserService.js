import axiosClient from './axiosClient';

// UserService for interacting with AdminUserController endpoints
export const getUsers = async (page = 0, size = 10) => {
  const response = await axiosClient.get('/api/v1/admin/users', {
    params: { page, size },
  });
  return response.data; // Returns ApiResponse<GetUsersResponseDTO>
};

export const getUserById = async (id) => {
  const response = await axiosClient.get(`/api/v1/admin/users/${id}`);
  return response.data; // Returns ApiResponse<UserDetailResponse>
};

export const createUser = async (userData) => {
  const response = await axiosClient.post('/api/v1/admin/users', userData);
  return response.data; // Returns ApiResponse<UserDetailResponse>
};

export const updateUser = async (id, userData) => {
  const response = await axiosClient.put(`/api/v1/admin/users/${id}`, userData);
  return response.data; // Returns ApiResponse<UserDetailResponse>
};

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/api/v1/admin/users/${id}`);
  return response.data; // Returns ApiResponse<UserDetailResponse>
};
export const getUsersByRole = async (role, page = 0, size = 10) => {
  const response = await axiosClient.get('/api/v1/admin/users/by-role', {
    params: { role, page, size },
  });
  return response.data; // Adjust to access ApiResponse.data
};