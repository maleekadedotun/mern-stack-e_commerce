import { configureStore } from "@reduxjs/toolkit";
// import usersReducers from "../slices/users/userSlice";
import usersReducers from "../slices/users/userSlice"; // ✅ this must be the reducer
import productReducer from "../slices/product/productSlices"; // ✅ this must be the reducer
import categoryReducer from "../slices/category.js/categorySlice";
import brandReducer from "../slices/brand.js/brandSlice";
import colorReducer from "../slices/color.js/colorSlice";
import cartReducer from "../slices/cart/cartSlice";
import couponsReducer from "../slices/coupon/couponsSlice";
import orderReducer from "../slices/order/orderSlice";
import reviewsReducer from "../slices/review/reviewsSlice";

// store 

const store = configureStore({
    reducer: {
        users: usersReducers,
        products: productReducer,
        categories: categoryReducer,
        brands: brandReducer,
        colors: colorReducer,
        carts: cartReducer,
        coupons: couponsReducer,
        orders: orderReducer,
        reviews: reviewsReducer,
    }
})

export default store