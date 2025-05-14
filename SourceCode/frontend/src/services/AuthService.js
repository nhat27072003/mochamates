import axiosClient from "./axiosClient"

const login = async (data) => {
  const response = await axiosClient.post('/api/v1/auth/login', data);
  return response;

}

const register = async (data) => {
  console.log(data)
  const response = await axiosClient.post('/api/v1/auth/register', data);
  return response;
}

const verifyOTP = async (data) => {
  console.log('check verify data', data);
  const response = await axiosClient.post('/api/v1/auth/verify', { usernameOrEmail: data?.usernameOrEmail, code: data?.otp });
  return response;
}

const getVerifyOTP = async (data) => {
  console.log('check verify', data)
  const response = await axiosClient.post('api/v1/auth/getVerify', data)
  return response;
}
export {
  login,
  verifyOTP,
  register,
  getVerifyOTP
}