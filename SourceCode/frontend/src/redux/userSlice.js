import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../services/axiosClient";
import { jwtDecode } from "jwt-decode";

// Async thunks for auth API calls
export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/login", data);
      const decoded = jwtDecode(response.data.accessToken);
      return {
        accessToken: response.data.accessToken,
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/register", data);
      return response.data; // Success message or user data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/verify", {
        usernameOrEmail: data?.usernameOrEmail,
        code: data?.otp,
      });
      const decoded = jwtDecode(response.data.accessToken);
      return {
        accessToken: response.data.accessToken,
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

export const getVerifyOTP = createAsyncThunk(
  "user/getVerifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/getVerify", data);
      return response.data; // OTP sent confirmation
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to request OTP");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/api/v1/auth/refresh");
      const decoded = jwtDecode(response.data.accessToken);
      return {
        accessToken: response.data.accessToken,
        userId: decoded.sub,
        role: decoded.role,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Token refresh failed");
    }
  }
);

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = {
        userId: action.payload.user.userId,
        username: action.payload.user.username,
        role: action.payload.user.role,
      };
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    resetError: (state) => {
      state.error = null;
    },
    restoreSession: (state, action) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        };
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify({
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        };
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify({
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        }));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Get verify OTP
    builder
      .addCase(getVerifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getVerifyOTP.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getVerifyOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        };
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify({
          userId: action.payload.userId,
          username: action.payload.userId.toString(),
          role: action.payload.role,
        }));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.currentUser = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      });
  },
});

export const { loginSuccess, logout, resetError, restoreSession } = userSlice.actions;
export default userSlice.reducer;
