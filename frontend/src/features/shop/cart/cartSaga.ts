import { call, put, select, takeLatest, delay } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { cartApi, type CartItemApiDto } from "./cartApi";
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCartRequest,
    fetchCartSuccess,
    fetchCartFailure,
    selectCartItems,
    type CartItem,
} from "./cartSlice";
import { setUser, setUnauthenticated, checkAuthDone } from "../../auth/authSlice";
import type { RootState } from "../../../app/store";

/* ── Map backend DTO → CartItem ── */
function mapApiItemToCartItem(dto: CartItemApiDto): CartItem {
    const pd = dto.product_details;
    const featureImg = pd?.images?.find((img) => img.is_feature);
    const image = featureImg?.image ?? pd?.image ?? null;
    const price = parseFloat(pd?.price ?? "0") || 0;
    const discountPrice = pd?.discount_price ? parseFloat(pd.discount_price) || undefined : undefined;
    const finalPrice = parseFloat(pd?.final_price ?? pd?.price ?? "0") || price;

    return {
        id: pd?.id ?? dto.product,
        cartItemId: dto.id,
        name: pd?.name ?? `Product #${dto.product}`,
        price,
        discountPrice,
        finalPrice,
        image,
        quantity: dto.quantity,
        stock: pd?.stock ?? 999,
        sku: pd?.sku ?? "",
        category: pd?.category_name ?? "",
    };
}

/* ── Fetch cart from API ── */
function* fetchCartWorker(): SagaIterator {
    try {
        const isAuthenticated: boolean = yield select(
            (state: RootState) => state.auth.isAuthenticated
        );
        if (!isAuthenticated) {
            yield put(fetchCartSuccess([]));
            return;
        }

        const data: Awaited<ReturnType<typeof cartApi.fetchCart>> = yield call(
            cartApi.fetchCart
        );
        const items: CartItem[] = Array.isArray(data?.items)
            ? data.items.map(mapApiItemToCartItem)
            : [];
        yield put(fetchCartSuccess(items));
    } catch (e: any) {
        const msg =
            e?.response?.data?.detail ||
            e?.response?.data?.message ||
            e?.message ||
            "Failed to load cart";
        yield put(fetchCartFailure(msg));
    }
}

/* ── Load cart when user logs in or session is restored ── */
function* onAuthSuccess(): SagaIterator {
    yield put(fetchCartRequest());
}

/* ── Clear cart on logout ── */
function* onLogout(): SagaIterator {
    yield put(clearCart());
}

/* ── Sync cart to API after every mutation (debounced) ── */
function* syncCartWorker(): SagaIterator {
    try {
        yield delay(800);

        const isAuthenticated: boolean = yield select(
            (state: RootState) => state.auth.isAuthenticated
        );
        if (!isAuthenticated) return;

        const items: CartItem[] = yield select(selectCartItems);
        const payload = items.map((item) => ({
            product: item.id,
            quantity: item.quantity,
        }));

        yield call(cartApi.syncCart, payload);
    } catch (e) {
        console.error("Cart sync error:", e);
    }
}

export function* cartSaga(): SagaIterator {
    // Fetch cart when auth is confirmed (login or page reload session check)
    yield takeLatest([setUser.type, checkAuthDone.type], onAuthSuccess);

    // Fetch cart on explicit request
    yield takeLatest(fetchCartRequest.type, fetchCartWorker);

    // Clear cart on logout
    yield takeLatest(setUnauthenticated.type, onLogout);

    // Sync to API on every mutation (debounced)
    yield takeLatest(
        [addToCart.type, removeFromCart.type, updateQuantity.type],
        syncCartWorker
    );
}
