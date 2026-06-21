import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false,
        error: null,
        isDeleted: false,
        isUpdated: false,
        productsCount: 0,
        resultPerPage: 0,
        filteredProductsCount: 0,
    },
    reducers: {
        // Request handlers
        productsRequest(state) {
            state.loading = true;
            state.products = [];
        },
        allProductsSuccess(state, action) {
            state.loading = false;
            state.products = action.payload.products;
            state.productsCount = action.payload.productsCount;
            state.resultPerPage = action.payload.resultPerPage;
            state.filteredProductsCount = action.payload.filteredProductsCount;
        },
        adminProductsSuccess(state, action) {
            state.loading = false;
            state.products = action.payload;
        },
        productsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        productOperationRequest(state) {
            state.loading = true;
        },
        deleteProductSuccess(state, action) {
            state.loading = false;
            state.isDeleted = action.payload;
        },
        updateProductSuccess(state, action) {
            state.loading = false;
            state.isUpdated = action.payload;
        },
        productOperationFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetDeleteProduct(state) {
            state.isDeleted = false;
        },
        resetUpdateProduct(state) {
            state.isUpdated = false;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    productsRequest,
    allProductsSuccess,
    adminProductsSuccess,
    productsFail,
    productOperationRequest,
    deleteProductSuccess,
    updateProductSuccess,
    productOperationFail,
    resetDeleteProduct,
    resetUpdateProduct,
    clearErrors,
} = productsSlice.actions;

export default productsSlice.reducer;
