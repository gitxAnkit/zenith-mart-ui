import { createSlice } from '@reduxjs/toolkit';

const newProductSlice = createSlice({
    name: 'newProduct',
    initialState: {
        product: {},
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        newProductRequest(state) {
            state.loading = true;
        },
        newProductSuccess(state, action) {
            state.loading = false;
            state.success = action.payload.success;
            state.product = action.payload.product;
        },
        newProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetNewProduct(state) {
            state.success = false;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    newProductRequest,
    newProductSuccess,
    newProductFail,
    resetNewProduct,
    clearErrors,
} = newProductSlice.actions;

export default newProductSlice.reducer;
