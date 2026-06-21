import api from "../axiosInstance";
import { addToCart, removeCartItem, saveShippingInfo } from "../redux/slices/cartSlice";
// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch) => {
    const { data } = await api.get(`/product/${id}`);

    const cartItem = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.Stock,
        quantity,
    };

    dispatch(addToCart(cartItem));
};

// Remove from Cart
export const removeItemsFromCart = (id) => (dispatch) => {
    dispatch(removeCartItem(id));
};

// Save Shipping Info
export const saveShippingInfoAction = (data) => (dispatch) => {
    dispatch(saveShippingInfo(data));
};
