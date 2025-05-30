import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../services/axiosClient";

const API_URL = "http://localhost:8080/api/v1/cart";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      const response = await axiosClient.get('/api/v1/cart');
      console.log('check get cart', response)
      return response.data;
    } catch (error) {
      console.error("Fetch cart error:", error);
      return rejectWithValue(error.response?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      console.log("Sending cart item to API:", item);
      const response = await axiosClient.post('/api/v1/cart', item);
      console.log("API response:", response);
      return response;
    } catch (error) {
      console.error("Add to cart error:", error);
      return rejectWithValue(error.response?.message || "Failed to add item to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, newQty }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      const response = await axiosClient.put(`${API_URL}/${itemId}`, Number(newQty), {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('check reponse update', response)
      return response.data;
    } catch (error) {
      console.error("Update cart error:", error);
      return rejectWithValue(error.response?.message || "Failed to update cart item");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      const response = await axiosClient.delete(`/api/v1/cart/${itemId}`)
      console.log('check delete item ', response)
      return response;
    } catch (error) {
      console.error("Remove from cart error:", error);
      return rejectWithValue(error.response?.message || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      await axiosClient.delete('/api/v1/cart');
      return { items: [], subtotal: 0, shipping: 10000, total: 10000 };
    } catch (error) {
      console.error("Clear cart error:", error);
      return rejectWithValue(error.response?.message || "Failed to clear cart");
    }
  }
);

export const applyPromoCode = createAsyncThunk(
  "cart/applyPromoCode",
  async (promoCode, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.token;
      if (!token) return rejectWithValue("No authentication token");
      const response = await axiosClient.post(`${API_URL}/promo`, { promoCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      console.error("Apply promo error:", error);
      return rejectWithValue(error.response?.message || "Failed to apply promo code");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    shipping: 10000,
    total: 10000,
    status: "idle",
    error: null,
    promo: null,
  },
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.shipping = action.payload.shipping || 10000;
        state.total = action.payload.total || 10000;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.shipping = action.payload.shipping || 10000;
        state.total = action.payload.total || 10000;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.shipping = action.payload.shipping || 10000;
        state.total = action.payload.total || 10000;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.shipping = action.payload.shipping || 10000;
        state.total = action.payload.total || 10000;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.shipping = action.payload.shipping || 10000;
        state.total = action.payload.total || 10000;
        state.error = null;
        state.promo = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Apply promo code
    builder
      .addCase(applyPromoCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promo = action.payload || null;
        state.error = null;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
