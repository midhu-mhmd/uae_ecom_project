import { api } from "../../../services/api";

/* ── Product Details inside cart item ── */
export interface CartProductDetailsDto {
    id: number;
    category: number;
    category_name: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    discount_price: string | null;
    final_price: string;
    stock: number;
    is_available: boolean;
    image: string | null;
    sku: string;
    expected_delivery_time: string | null;
    images: {
        id: number;
        image: string;
        is_feature: boolean;
        created_at: string;
    }[];
    average_rating: number;
    total_reviews: number;
    created_at: string;
    updated_at: string;
}

/* ── Cart Item DTO ── */
export interface CartItemDto {
    id: number;
    product: number;
    product_details: CartProductDetailsDto;
    quantity: number;
    subtotal: string;
    created_at: string;
    updated_at: string;
}

/* ── Cart DTO from backend ── */
export interface CartDto {
    id: number;
    user: number;
    items: CartItemDto[];
    total_price: string;
    total_items: number;
    created_at: string;
    updated_at: string;
}

export type CartsQuery = {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
};

export const cartsApi = {
    list: async (
        params?: CartsQuery
    ): Promise<{ results: CartDto[]; count: number }> => {
        const res = await api.get<{ results: CartDto[]; count: number }>(
            "/cart/",
            { params }
        );
        return res.data;
    },

    details: async (id: number): Promise<CartDto> => {
        const res = await api.get<CartDto>(`/cart/${id}/`);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/cart/${id}/`);
    },
};
