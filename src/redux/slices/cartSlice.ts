import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, ShippingInfo } from '../../types';

interface CartState {
    cartItems: CartItem[];
    shippingInfo: ShippingInfo | Record<string, never>;
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingInfo: {},
    } as CartState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );
            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                );
            } else {
                state.cartItems.push(item);
            }
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter(
                (i) => i.product !== action.payload
            );
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
    },
});

export const { addToCart, removeCartItem, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
