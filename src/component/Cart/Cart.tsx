import React, { Fragment } from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart, removeCartItem } from '../../redux/slices/cartSlice';
import { Typography, Button } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../../ErrorBoundary';
import type { CartItem } from '../../types';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems } = useAppSelector((state) => state.cart);

  const increaseQuantity = (item: CartItem) => {
    const newQty = item.quantity + 1;
    if (item.stock <= item.quantity) {
      toast.error('Cannot exceed stock limit');
      return;
    }
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  const decreaseQuantity = (item: CartItem) => {
    const newQty = item.quantity - 1;
    if (item.quantity <= 1) {
      return;
    }
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  const deleteCartItems = (id: string) => {
    dispatch(removeCartItem(id));
    toast.success('Item removed from cart');
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <ErrorBoundary>
      <Fragment>
        {cartItems.length === 0 ? (
          <div className="emptyCart">
            <RemoveShoppingCartIcon />
            <Typography>No Product in Your Cart</Typography>
            <Link to="/products">View Products</Link>
          </div>
        ) : (
          <Fragment>
            <div className="cartPage">
              <div className="cartHeader">
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
              </div>

              {cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard
                    item={item}
                    deleteCartItems={deleteCartItems}
                  />
                  <div className="cartInput">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => decreaseQuantity(item)}
                    >
                      -
                    </Button>
                    <input type="number" value={item.quantity} readOnly />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => increaseQuantity(item)}
                    >
                      +
                    </Button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}

              <div className="cartGrossProfit">
                <div></div>
                <div className="cartGrossProfitBox">
                  <p>Gross Total</p>
                  <p>{`₹${cartItems.reduce(
                    (acc, item) => acc + item.quantity * item.price,
                    0
                  )}`}</p>
                </div>
                <div></div>
                <div className="checkOutBtn">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={checkoutHandler}
                  >
                    Check Out
                  </Button>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    </ErrorBoundary>
  );
};

export default Cart;
