import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../types";

interface OrderState {
    orders: Order[];
    order: Order | null;
    loading: boolean;
    error: string | null;
    isUpdated: boolean;
    isDeleted: boolean;
    totalAmount: number;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    isUpdated: false,
    isDeleted: false,
    totalAmount: 0,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        createOrderRequest: (state) => {
            state.loading = true;
        },
        createOrderSuccess: (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.order = action.payload;
        },
        createOrderFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        myOrdersRequest: (state) => {
            state.loading = true;
        },
        myOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.orders = action.payload;
        },
        myOrdersFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        allOrdersRequest: (state) => {
            state.loading = true;
        },
        allOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.orders = action.payload;
        },
        allOrdersFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        totalOrderAmount: (state, action: PayloadAction<number>) => {
            state.totalAmount = action.payload;
        },
        updateOrderRequest: (state) => {
            state.loading = true;
        },
        updateOrderSuccess: (state, action: PayloadAction<boolean>) => {
            state.loading = false;
            state.isUpdated = action.payload;
        },
        updateOrderFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateOrderReset: (state) => {
            state.isUpdated = false;
        },
        deleteOrderRequest: (state) => {
            state.loading = true;
        },
        deleteOrderSuccess: (state, action: PayloadAction<boolean>) => {
            state.loading = false;
            state.isDeleted = action.payload;
        },
        deleteOrderFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteOrderReset: (state) => {
            state.isDeleted = false;
        },
        orderDetailsRequest: (state) => {
            state.loading = true;
        },
        orderDetailsSuccess: (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.order = action.payload;
        },
        orderDetailsFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    myOrdersRequest,
    myOrdersSuccess,
    myOrdersFail,
    allOrdersRequest,
    allOrdersSuccess,
    allOrdersFail,
    updateOrderRequest,
    updateOrderSuccess,
    updateOrderFail,
    updateOrderReset,
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFail,
    deleteOrderReset,
    orderDetailsRequest,
    orderDetailsSuccess,
    orderDetailsFail,
    clearErrors,
    totalOrderAmount
} = orderSlice.actions;

export default orderSlice.reducer;
