import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

// 1. Define the Product Interface
export interface CartItem {
  id: number;
  name: string;
  price: number;
  discountPrice?: number; // Optional
  finalPrice: number;
  image: string | null;
  quantity: number;
  stock: number;
  sku?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // For toggling the cart sidebar/drawer
}

// 2. Load initial state from sessionStorage
const persistedCart = sessionStorage.getItem('cart');
const initialState: CartState = {
  items: persistedCart ? JSON.parse(persistedCart) : [],
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Toggle Cart Drawer
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // Add Item or Increment Quantity
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // Save to session
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Remove specific item
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Update quantity (for input fields in Cart page)
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && action.payload.quantity > 0 && action.payload.quantity <= item.stock) {
        item.quantity = action.payload.quantity;
      }
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Clear cart after successful checkout
    clearCart: (state) => {
      state.items = [];
      sessionStorage.removeItem('cart');
    },
  },
});

export const { toggleCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// 3. Advanced Selectors (Memoized logic)
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total: number, item: CartItem) => total + item.finalPrice * item.quantity, 0);

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count: number, item: CartItem) => count + item.quantity, 0);

export default cartSlice.reducer;