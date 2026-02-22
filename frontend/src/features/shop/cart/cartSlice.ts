import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

export interface CartItem {
  id: number;         // product id
  cartItemId?: number; // backend cart item id (for reference)
  name: string;
  price: number;
  discountPrice?: number;
  finalPrice: number;
  image: string | null;
  quantity: number;
  stock: number;
  sku?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // ── UI ──
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // ── Fetch cart from API ──
    fetchCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Optimistic local mutations (saga syncs to API) ──
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        if (existing.quantity < existing.stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && action.payload.quantity > 0 && action.payload.quantity <= item.stock) {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  toggleCart,
  fetchCartRequest,
  fetchCartSuccess,
  fetchCartFailure,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;