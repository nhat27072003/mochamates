import { jwtDecode } from "jwt-decode";
import axiosClient from "./axiosClient"
import axios from "axios";
import { restoreSession } from "../redux/userSlice";
import { useDispatch } from "react-redux";

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

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/refresh`,
      null,
      { withCredentials: true }
    );

    if (response.data.statusCode === "1000") {
      const accessToken = response.data.accessToken;

      // Giải mã để lấy userId (nếu không có trong response)
      const decoded = jwtDecode(accessToken);
      const userId = decoded.sub;

      const freshUser = {
        userId: userId,
        username: response.data.username,
        role: response.data.role,
      };

      // Lưu vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(freshUser));

      // Dispatch restoreSession
      // store.dispatch(
      //   restoreSession({
      //     token: accessToken,
      //     user: freshUser,
      //   })
      // );

      return accessToken;
    }

    return null; // Trường hợp server không trả statusCode 1000
  } catch (err) {
    console.error("Failed to refresh token", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return null;
  }
};


export {
  login,
  verifyOTP,
  register,
  getVerifyOTP,
  fetchAccessToken,
}