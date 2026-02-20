import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";
import type { CartsQuery } from "./cartApi";

type Status = "idle" | "loading" | "succeeded" | "failed";

export interface AdminCartItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string | null;
    productPrice: number;
    discountPrice: number | null;
    finalPrice: number;
    sku: string;
    categoryName: string;
    quantity: number;
    subtotal: number;
}

export interface AdminCart {
    id: number;
    userId: number;
    items: AdminCartItem[];
    totalPrice: number;
    totalItems: number;
    createdAt: string;
    updatedAt: string;
}

interface AdminCartsState {
    items: AdminCart[];
    totalCount: number;
    currentPage: number;
    status: Status;
    error: string | null;
    selectedId: number | null;
    lastQuery: CartsQuery | null;
}

const initialState: AdminCartsState = {
    items: [],
    totalCount: 0,
    currentPage: 1,
    status: "idle",
    error: null,
    selectedId: null,
    lastQuery: null,
};

const adminCartsSlice = createSlice({
    name: "adminCarts",
    initialState,
    reducers: {
        fetchCartsRequest: (
            state,
            action: PayloadAction<CartsQuery | undefined>
        ) => {
            state.status = "loading";
            state.error = null;
            state.lastQuery = action.payload ?? null;
        },
        fetchCartsSuccess: (
            state,
            action: PayloadAction<{
                items: AdminCart[];
                totalCount: number;
                page: number;
            }>
        ) => {
            state.status = "succeeded";
            state.items = action.payload.items;
            state.totalCount = action.payload.totalCount;
            state.currentPage = action.payload.page;
        },
        fetchCartsFailure: (state, action: PayloadAction<string>) => {
            state.status = "failed";
            state.error = action.payload;
        },
        setSelectedCartId: (state, action: PayloadAction<number | null>) => {
            state.selectedId = action.payload;
        },
    },
});

export const adminCartsActions = adminCartsSlice.actions;
export default adminCartsSlice.reducer;

// Selectors
export const selectAdminCarts = (s: RootState) => s.adminCarts.items;
export const selectAdminCartsTotal = (s: RootState) => s.adminCarts.totalCount;
export const selectAdminCartsPage = (s: RootState) => s.adminCarts.currentPage;
export const selectAdminCartsStatus = (s: RootState) => s.adminCarts.status;
export const selectAdminCartsError = (s: RootState) => s.adminCarts.error;
export const selectSelectedCartId = (s: RootState) => s.adminCarts.selectedId;
