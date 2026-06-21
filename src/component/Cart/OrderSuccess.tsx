import React, { useEffect } from 'react';
import { CheckCircle } from '@mui/icons-material';
import { Typography, Link } from '@mui/material';
import './orderSuccess.css';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearCart } from '../../redux/slices/cartSlice';

const OrderSuccess: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      // Clear session storage
      sessionStorage.removeItem(`orderInfo_${userId}`);
    }

    // Clear cart items from localStorage
    localStorage.removeItem('cartItems');

    // Clear cart items from Redux store
    dispatch(clearCart());
  }, [userId, dispatch]);

  return (
    <div className="orderSuccess">
      <CheckCircle sx={{ fontSize: 50, color: 'green' }} />
      <Typography variant="h4">
        Your Order has been placed successfully
      </Typography>
      <Link component={RouterLink} to="/orders" variant="body1">
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
