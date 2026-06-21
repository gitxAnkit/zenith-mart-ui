// store.js

import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './slices/product/productsSlice';
import reviewSlice from './slices/product/reviewSlice';
import productReviewSlice from './slices/product/productReviewSlice';
import newReviewSlice from './slices/product/newReviewSlice';
import newProductSlice from './slices/product/newProductSlice';
import productDetailsSlice from './slices/product/productDetailsSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import stripeSlice from './slices/stripeSlice';
// Preload state from localStorage
const preloadedState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    },
};

const store = configureStore({
    reducer: {
        products: productsSlice,
        productReview: productReviewSlice,
        productDetails: productDetailsSlice,
        newReview: newReviewSlice,
        newProduct: newProductSlice,
        review: reviewSlice,
        cart: cartSlice,
        order: orderSlice,
        user: userSlice,
        stripe: stripeSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
});

// Subscribe to store changes and persist cart to localStorage
store.subscribe(() => {
    const { cart } = store.getState();
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems));
    localStorage.setItem('shippingInfo', JSON.stringify(cart.shippingInfo));
});

export default store;
