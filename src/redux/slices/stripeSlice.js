import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getStripeApiKey = createAsyncThunk(
    "stripe/getStripeApiKey",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/stripeapikey");
            return data.stripeApiKey;
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data.message : error.message
            );
        }
    }
);

const initialState = {
    stripeApiKey: null,
    loading: false,
    error: null,
};

const stripeSlice = createSlice({
    name: "stripe",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStripeApiKey.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStripeApiKey.fulfilled, (state, action) => {
                state.loading = false;
                state.stripeApiKey = action.payload;
            })
            .addCase(getStripeApiKey.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default stripeSlice.reducer;
