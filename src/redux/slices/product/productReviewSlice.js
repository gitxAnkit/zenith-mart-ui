
import { createSlice } from '@reduxjs/toolkit';

const productReviewsSlice = createSlice({
    name: 'productReviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
    },
    reducers: {
        allReviewRequest(state) {
            state.loading = true;
        },
        allReviewSuccess(state, action) {
            state.loading = false;
            state.reviews = action.payload;
        },
        allReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    allReviewRequest,
    allReviewSuccess,
    allReviewFail,
    clearErrors,
} = productReviewsSlice.actions;

export default productReviewsSlice.reducer;
