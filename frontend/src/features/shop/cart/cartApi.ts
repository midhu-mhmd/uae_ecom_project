import { api } from "../../../services/api";

/* ── Response Types from Backend ── */
export interface CartItemApiDto {
    id: number;
    product: number;
    product_details: {
        id: number;
        name: string;
        price: string;
        discount_price: string | null;
        final_price: string;
        image: string | null;
        sku: string;
        stock: number;
        category_name: string;
        images?: { id: number; image: string; is_feature: boolean }[];
    };
    quantity: number;
    subtotal: string;
}

export interface CartApiDto {
    id: number;
    user: number;
    items: CartItemApiDto[];
    total_price: string;
    total_items: number;
    created_at: string;
    updated_at: string;
}

export const cartApi = {
    /** GET /cart/me/ — fetch the current user's cart */
    fetchCart: async (): Promise<CartApiDto> => {
        const res = await api.get<CartApiDto>("/cart/me/");
        return res.data;
    },

    /** POST /cart/sync/ — replace entire cart */
    syncCart: async (items: { product: number; quantity: number }[]): Promise<void> => {
        await api.post("/cart/sync/", { items });
    },
};
