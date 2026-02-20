import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { cartsApi } from "./cartApi";
import { adminCartsActions } from "./cartSlice";
import type { AdminCart, AdminCartItem } from "./cartSlice";
import type { CartDto, CartItemDto } from "./cartApi";
import type { RootState } from "../../../app/store";

function mapCartItemDto(dto: CartItemDto): AdminCartItem {
    const pd = dto.product_details;
    // Get the best image: feature image first, then main image
    const featureImage = pd?.images?.find((img) => img.is_feature);
    const imageUrl = featureImage?.image ?? pd?.image ?? null;

    return {
        id: dto.id,
        productId: dto.product,
        productName: pd?.name ?? `Product #${dto.product}`,
        productImage: imageUrl,
        productPrice: parseFloat(pd?.price ?? "0") || 0,
        discountPrice: pd?.discount_price ? parseFloat(pd.discount_price) || null : null,
        finalPrice: parseFloat(pd?.final_price ?? pd?.price ?? "0") || 0,
        sku: pd?.sku ?? "",
        categoryName: pd?.category_name ?? "",
        quantity: dto.quantity,
        subtotal: parseFloat(dto.subtotal ?? "0") || 0,
    };
}

/* ── Map backend DTO → UI AdminCart ── */
function mapCartDtoToCart(dto: CartDto): AdminCart {
    const items = Array.isArray(dto.items)
        ? dto.items.map(mapCartItemDto)
        : [];

    return {
        id: dto.id,
        userId: dto.user,
        items,
        totalPrice: parseFloat(dto.total_price ?? "0") || 0,
        totalItems: dto.total_items ?? items.length,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

/** Normalize any API shape → AdminCart[] */
function normalizeCarts(payload: any): AdminCart[] {
    if (Array.isArray(payload?.results))
        return payload.results.map(mapCartDtoToCart);
    if (Array.isArray(payload)) return payload.map(mapCartDtoToCart);
    if (Array.isArray(payload?.data))
        return payload.data.map(mapCartDtoToCart);
    return [];
}

function* fetchCartsWorker(
    action: ReturnType<typeof adminCartsActions.fetchCartsRequest>
): SagaIterator {
    try {
        const auth: any = yield select((state: RootState) => (state as any).auth);
        if (auth && auth.isAuthenticated === false) {
            yield put(adminCartsActions.fetchCartsFailure("User not authenticated"));
            return;
        }

        const raw: any = yield call(cartsApi.list, action.payload);
        const totalCount = raw?.count || 0;
        const items = normalizeCarts(raw);
        const page = action.payload?.page || 1;

        yield put(
            adminCartsActions.fetchCartsSuccess({
                items,
                totalCount,
                page,
            })
        );
    } catch (e: any) {
        console.error("Fetch Carts Error:", {
            status: e?.response?.status,
            data: e?.response?.data,
            message: e?.message,
        });

        const errMsg =
            e?.response?.data?.detail ||
            e?.response?.data?.message ||
            e?.message ||
            "Failed to fetch carts";

        yield put(adminCartsActions.fetchCartsFailure(errMsg));
    }
}

export function* adminCartsSaga(): SagaIterator {
    yield takeLatest(
        adminCartsActions.fetchCartsRequest.type,
        fetchCartsWorker
    );
}
