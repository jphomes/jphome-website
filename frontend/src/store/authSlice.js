import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";

const TOKEN_KEY = "sondagar_admin_token";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem(TOKEN_KEY, res.data.token);
      return { token: res.data.token, admin: res.data.admin };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed.");
    }
  }
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue, getState }) => {
  const token = getState().auth.token || localStorage.getItem(TOKEN_KEY);
  if (!token) return rejectWithValue("No token");
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    localStorage.removeItem(TOKEN_KEY);
    return rejectWithValue(err.response?.data?.message || "Session expired.");
  }
});

const initialToken = typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken,
    admin: null,
    loading: Boolean(initialToken),
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.admin = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem(TOKEN_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.admin = null;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectAdmin = (state) => state.auth.admin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.admin);

export default authSlice.reducer;
