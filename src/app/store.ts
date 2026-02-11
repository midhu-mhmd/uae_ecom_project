import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/shop/cart/cartSlice';
import catalogReducer from '../features/shop/catalog/catalogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,     // Persist this usually (e.g., localStorage)
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;