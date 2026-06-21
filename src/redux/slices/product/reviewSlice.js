import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        loading: false,
        isDeleted: false,
        error: null,
    },
    reducers: {
        deleteReviewRequest(state) {
            state.loading = true;
        },
        deleteReviewSuccess(state, action) {
            state.loading = false;
            state.isDeleted = action.payload;
        },
        deleteReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetDeleteReview(state) {
            state.isDeleted = false;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail,
    resetDeleteReview,
    clearErrors,
} = reviewSlice.actions;

export default reviewSlice.reducer;
