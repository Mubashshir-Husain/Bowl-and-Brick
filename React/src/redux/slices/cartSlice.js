import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'bowl_brick_cart_items';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to parse cart from storage:', err);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to storage:', err);
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // expect full dish object plus optional quantity
      const qtyToAdd = item.quantity || 1;
      const existingIndex = state.items.findIndex((i) => i._id === item._id);

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += qtyToAdd;
      } else {
        state.items.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          type: item.type,
          spiceLevel: item.spiceLevel,
          quantity: qtyToAdd,
        });
      }
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((i) => i._id === id);
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== id);
        } else {
          existingItem.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i._id !== id);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalAmount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
