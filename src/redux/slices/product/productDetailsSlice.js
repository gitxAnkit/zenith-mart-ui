import { createSlice } from '@reduxjs/toolkit';

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: {
        product: {},
        loading: false,
        error: null,
    },
    reducers: {
        productDetailsRequest(state) {
            state.loading = true;
        },
        productDetailsSuccess(state, action) {
            state.loading = false;
            state.product = action.payload;
        },
        productDetailsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    productDetailsRequest,
    productDetailsSuccess,
    productDetailsFail,
    clearErrors,
} = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
