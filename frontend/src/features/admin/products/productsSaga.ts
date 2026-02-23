import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { productsApi } from "./productApi";
import { productsActions } from "./productsSlice";
import type { Product } from "./productsSlice";
import type { ProductDto } from "./productApi";
import type { RootState } from "../../../app/store";

/* ── Map backend DTO → UI Product ── */
function mapProductDtoToProduct(dto: ProductDto): Product {
    const featureImage =
        dto.images?.find((img) => img.is_feature) ?? dto.images?.[0];

    let status: Product["status"] = "Active";
    if (!dto.is_available) status = "Draft";
    else if (dto.stock <= 0) status = "Out of Stock";

    const price = parseFloat(dto.price) || 0;
    const discountPrice = dto.discount_price ? parseFloat(dto.discount_price) : null;
    const finalPrice = parseFloat(dto.final_price) || price;

    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        categoryId: dto.category,
        categoryName: dto.category_name ?? "Uncategorized",
        price,
        discountPrice,
        finalPrice,
        sku: dto.sku,
        stock: dto.stock,
        isAvailable: dto.is_available,
        status,
        imageUrl: featureImage?.image ?? dto.image ?? null,
        images: Array.isArray(dto.images)
            ? dto.images.map((img) => ({
                id: img.id,
                url: img.image,
                isFeature: img.is_feature,
            }))
            : [],
        averageRating: dto.average_rating ?? 0,
        totalReviews: dto.total_reviews ?? 0,
        expectedDeliveryTime: dto.expected_delivery_time ?? null,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

/** Normalize any API shape → Product[] */
function normalizeProducts(payload: any): Product[] {
    if (Array.isArray(payload?.results)) {
        return payload.results.map(mapProductDtoToProduct);
    }
    if (Array.isArray(payload)) return payload.map(mapProductDtoToProduct);
    if (Array.isArray(payload?.data))
        return payload.data.map(mapProductDtoToProduct);
    return [];
}

function* fetchProductsWorker(
    action: ReturnType<typeof productsActions.fetchProductsRequest>
): SagaIterator {
    try {
        const auth: any = yield select((state: RootState) => (state as any).auth);
        if (auth && auth.isAuthenticated === false) {
            yield put(productsActions.fetchProductsFailure("User not authenticated"));
            return;
        }

        const raw: any = yield call(productsApi.list, action.payload);
        const totalCount = raw?.count || 0;
        const items = normalizeProducts(raw);
        const page = action.payload?.page || 1;

        yield put(
            productsActions.fetchProductsSuccess({
                items,
                totalCount,
                page,
            })
        );
    } catch (e: any) {
        console.error("Fetch Products Error:", {
            status: e?.response?.status,
            data: e?.response?.data,
            message: e?.message,
        });

        const errMsg =
            e?.response?.data?.detail ||
            e?.response?.data?.message ||
            e?.message ||
            "Failed to fetch products";

        yield put(productsActions.fetchProductsFailure(errMsg));
    }
}

function* createProductWorker(
    action: ReturnType<typeof productsActions.createProductRequest>
): SagaIterator {
    try {
        const payload = action.payload;
        // API call
        const dto: ProductDto = yield call(productsApi.create, payload);

        // Map DTO to UI model
        const product = mapProductDtoToProduct(dto);

        yield put(productsActions.createProductSuccess(product));
    } catch (e: any) {
        console.error("Create Product Error:", e);
        console.error("Response data:", e?.response?.data);
        console.error("Response status:", e?.response?.status);

        const data = e?.response?.data;
        let errMsg = "Failed to create product";

        if (typeof data === "string") {
            errMsg = data;
        } else if (data?.detail) {
            errMsg = data.detail;
        } else if (data?.message) {
            errMsg = data.message;
        } else if (data && typeof data === "object") {
            // Django validation errors: { field: ["error1", "error2"] }
            const fieldErrors = Object.entries(data)
                .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
                .join(" | ");
            if (fieldErrors) errMsg = fieldErrors;
        } else if (e?.message) {
            errMsg = e.message;
        }

        yield put(productsActions.createProductFailure(errMsg));
    }
}

function* updateProductWorker(
    action: ReturnType<typeof productsActions.updateProductRequest>
): SagaIterator {
    try {
        const { id, data } = action.payload;
        // API call
        const dto: ProductDto = yield call(productsApi.update, id, data);

        // Map DTO to UI model
        const product = mapProductDtoToProduct(dto);

        yield put(productsActions.updateProductSuccess(product));
    } catch (e: any) {
        console.error("Update Product Error:", e);
        const errMsg =
            e?.response?.data?.detail ||
            e?.response?.data?.message ||
            e?.message ||
            "Failed to update product";
        yield put(productsActions.updateProductFailure(errMsg));
    }
}

function* deleteProductWorker(
    action: ReturnType<typeof productsActions.deleteProductRequest>
): SagaIterator {
    try {
        const id = action.payload;
        // API call
        yield call(productsApi.delete, id);

        yield put(productsActions.deleteProductSuccess(id));
    } catch (e: any) {
        console.error("Delete Product Error:", e);
        const errMsg =
            e?.response?.data?.detail ||
            e?.response?.data?.message ||
            e?.message ||
            "Failed to delete product";
        yield put(productsActions.deleteProductFailure(errMsg));
    }
}

export function* productsSaga(): SagaIterator {
    yield takeLatest(productsActions.fetchProductsRequest.type, fetchProductsWorker);
    yield takeLatest(productsActions.createProductRequest.type, createProductWorker);
    yield takeLatest(productsActions.updateProductRequest.type, updateProductWorker);
    yield takeLatest(productsActions.deleteProductRequest.type, deleteProductWorker);
}
