import { createSlice } from '@reduxjs/toolkit';

const newReviewSlice = createSlice({
    name: 'newReview',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        newReviewRequest(state) {
            state.loading = true;
        },
        newReviewSuccess(state, action) {
            state.loading = false;
            state.success = action.payload;
        },
        newReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetNewReview(state) {
            state.success = false;
        },
        clearErrors(state) {
            state.error = null;
        },
    },
});

export const {
    newReviewRequest,
    newReviewSuccess,
    newReviewFail,
    resetNewReview,
    clearErrors,
} = newReviewSlice.actions;

export default newReviewSlice.reducer;
