import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import customerReducer from './slices/customerSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    admin: adminReducer,
  },
});
