import { api } from "../../../services/api";
import type { CartItem } from "./cartSlice";

export const cartApi = {
    syncCart: async (items: CartItem[]): Promise<void> => {
        // Map frontend items to backend expected shape
        const payload = {
            items: items.map(item => ({
                product: item.id,
                quantity: item.quantity
            }))
        };
        await api.post("/cart/sync/", payload);
    },

    // Optional: Fetch cart from backend on login
    fetchCart: async (): Promise<any> => {
        const res = await api.get("/cart/me/");
        return res.data;
    }
};
