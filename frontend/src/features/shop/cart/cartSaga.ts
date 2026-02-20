import { call, select, takeLatest, delay } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { cartApi } from "./cartApi";
import { addToCart, removeFromCart, updateQuantity, selectCartItems } from "./cartSlice";
import type { RootState } from "../../../app/store";

function* syncCartWorker(): SagaIterator {
    try {
        // Debounce to avoid too many API calls
        yield delay(1000);

        const isAuthenticated: boolean = yield select((state: RootState) => state.auth.isAuthenticated);

        if (isAuthenticated) {
            const items = yield select(selectCartItems);
            yield call(cartApi.syncCart, items);
        }
    } catch (e) {
        console.error("Cart Sync Error:", e);
    }
}

export function* cartSaga(): SagaIterator {
    yield takeLatest(
        [addToCart.type, removeFromCart.type, updateQuantity.type],
        syncCartWorker
    );
}
