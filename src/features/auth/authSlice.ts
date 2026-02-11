import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // True while checking if session exists on boot
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true, 
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Used after a successful login or "check-auth" call
    setAuth: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitializing = false;
      state.error = null;
    },
    // Used if the session check fails on startup
    finishInitializing: (state) => {
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      // Note: You must also call an API to clear the cookie on the server
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isInitializing = false;
    },
  },
});

export const { setLoading, setAuth, logout, setAuthError, finishInitializing } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectIsInitializing = (state: RootState) => state.auth.isInitializing;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;