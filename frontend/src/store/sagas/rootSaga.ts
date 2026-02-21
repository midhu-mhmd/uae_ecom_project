import { all, fork } from "redux-saga/effects";
import { catalogSaga } from "../../features/shop/catalog/catalogSaga";
import { customersSaga } from "../../features/admin/customers/customersSaga";
import { productsSaga } from "../../features/admin/products/productsSaga";
import { reviewsSaga } from "../../features/admin/reviews/reviewsSaga";
import { ordersSaga } from "../../features/admin/orders/ordersSaga";
import { adminCartsSaga } from "../../features/admin/cart/cartSaga";
import { paymentsSaga } from "../../features/admin/payments/paymentsSaga";
import { settingsSaga } from "../../features/admin/settings/settingsSaga";
import { authSaga } from "../../features/auth/authSaga";
import { cartSaga } from "../../features/shop/cart/cartSaga";

export function* rootSaga() {
  yield all([fork(catalogSaga), fork(customersSaga), fork(productsSaga), fork(reviewsSaga), fork(ordersSaga), fork(adminCartsSaga), fork(paymentsSaga), fork(settingsSaga), fork(authSaga), fork(cartSaga)]);
}
