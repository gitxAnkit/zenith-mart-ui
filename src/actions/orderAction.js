import api from "../axiosInstance";
import {
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
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFail,
    orderDetailsRequest,
    orderDetailsSuccess,
    orderDetailsFail,
    clearErrors,
    totalOrderAmount,
} from "../redux/slices/orderSlice";

// Create Order Action
export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch(createOrderRequest());

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await api.post(`/order/new`, order, config);
        dispatch(createOrderSuccess(data));

    } catch (error) {
        dispatch(createOrderFail(error.response.data.message));
    }
};

// My Orders Action
export const myOrders = () => async (dispatch) => {
    try {
        dispatch(myOrdersRequest());

        const { data } = await api.get(`/orders/me`);

        dispatch(myOrdersSuccess(data.orders));
    } catch (error) {
        dispatch(myOrdersFail(error.response.data.message));
    }
};

// Get All Orders (admin) Action
export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch(allOrdersRequest());

        const { data } = await api.get(`/admin/orders`);

        dispatch(allOrdersSuccess(data.orders));
        dispatch(totalOrderAmount(data.totalAmount));
    } catch (error) {
        dispatch(allOrdersFail(error.response.data.message));
    }
};

// Update Order Action
export const updateOrder = (id, order) => async (dispatch) => {
    try {
        dispatch(updateOrderRequest());

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await api.put(`/admin/order/${id}`, order, config);

        dispatch(updateOrderSuccess(data.success));
    } catch (error) {
        dispatch(updateOrderFail(error.response.data.message));
    }
};

// Delete Order Action
export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch(deleteOrderRequest());

        const { data } = await api.delete(`/admin/order/${id}`);

        dispatch(deleteOrderSuccess(data.success));
    } catch (error) {
        dispatch(deleteOrderFail(error.response.data.message));
    }
};

// Get Order Details Action
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch(orderDetailsRequest());

        const { data } = await api.get(`/order/${id}`);

        dispatch(orderDetailsSuccess(data.order));
    } catch (error) {
        dispatch(orderDetailsFail(error.response.data.message));
    }
};

// Clearing Errors
export const clearOrderErrors = () => async (dispatch) => {
    dispatch(clearErrors());
};
