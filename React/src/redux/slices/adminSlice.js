import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'bowl_brick_admin_token';
const ADMIN_INFO_KEY = 'bowl_brick_admin_info';

const initialToken = localStorage.getItem(TOKEN_KEY) || null;
const initialAdmin = JSON.parse(localStorage.getItem(ADMIN_INFO_KEY) || 'null');

const initialState = {
  token: initialToken,
  admin: initialAdmin,
  isAuthenticated: !!initialToken,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      const { token, admin } = action.payload;
      state.token = token;
      state.admin = admin;
      state.isAuthenticated = true;

      localStorage.setItem(TOKEN_KEY, token);
      if (admin) {
        localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(admin));
      }
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_INFO_KEY);
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;
