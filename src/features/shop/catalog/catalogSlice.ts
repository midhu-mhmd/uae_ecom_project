import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import api from '../../../services/api';

// 1. Define Product Type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

// 2. Define State Shape
interface CatalogState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string;
    search: string;
    sortBy: 'price-low' | 'price-high' | 'rating';
  };
}

const initialState: CatalogState = {
  products: [],
  filteredProducts: [],
  categories: [],
  status: 'idle',
  error: null,
  filters: {
    category: 'All',
    search: '',
    sortBy: 'price-low',
  },
};

// 3. Async Thunk to fetch products
export const fetchProducts = createAsyncThunk('catalog/fetchProducts', async () => {
  const response = await api.get<Product[]>('/products');
  return response.data;
});

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSortBy: (state, action: PayloadAction<CatalogState['filters']['sortBy']>) => {
      state.filters.sortBy = action.payload;
      state.filteredProducts = applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload; // Initially, filtered = all
        state.categories = ['All', ...new Set(action.payload.map((p) => p.category))];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// 4. Helper function for filtering logic
// Industry tip: Keeping this in the slice or a separate selector is better than in the UI
const applyFilters = (state: CatalogState) => {
  let temp = [...state.products];

  if (state.filters.category !== 'All') {
    temp = temp.filter((p) => p.category === state.filters.category);
  }

  if (state.filters.search) {
    temp = temp.filter((p) =>
      p.name.toLowerCase().includes(state.filters.search.toLowerCase())
    );
  }

  if (state.filters.sortBy === 'price-low') temp.sort((a, b) => a.price - b.price);
  if (state.filters.sortBy === 'price-high') temp.sort((a, b) => b.price - a.price);
  if (state.filters.sortBy === 'rating') temp.sort((a, b) => b.rating - a.rating);

  return temp;
};

export const { setCategoryFilter, setSearchFilter, setSortBy } = catalogSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.catalog.filteredProducts;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;

export default catalogSlice.reducer;