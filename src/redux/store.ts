import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';

// Preload state from localStorage
const preloadedState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems') as string)
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo') as string)
      : {},
  },
};

const store = configureStore({
  reducer: {
    cart: cartSlice,
    user: userSlice,
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

// ── TypeScript types ──────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
