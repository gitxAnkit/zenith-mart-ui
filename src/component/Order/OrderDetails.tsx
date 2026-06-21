import React, { Fragment, useEffect } from 'react';
import './OrderDetails.css';
import MetaData from '../layout/MetaData';
import { Link, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import Loader from '../layout/Loader/Loader';
import { toast } from 'react-toastify';
import ErrorBoundary from '../../ErrorBoundary';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderDetails(id);

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load order details');
    }
  }, [error]);

  const pricing = order
    ? {
        totalPrice: order.pricingInfo?.totalPrice ?? (order as any).totalPrice ?? 0,
      }
    : null;

  const orderUser = order?.user && typeof order.user === 'object' ? order.user : null;

  return (
    <ErrorBoundary>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">Order #{order?._id}</Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{orderUser?.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{order?.shippingInfo?.phoneNo}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {order?.shippingInfo &&
                      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order?.paymentInfo?.status === 'succeeded'
                        ? 'greenColor'
                        : 'redColor'
                    }
                  >
                    {order?.paymentInfo?.status === 'succeeded'
                      ? 'PAID'
                      : 'NOT PAID'}
                  </p>
                </div>

                <div>
                  <p>Amount:</p>
                  <span>{pricing?.totalPrice}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order?.orderStatus === 'Delivered'
                        ? 'greenColor'
                        : 'redColor'
                    }
                  >
                    {order?.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {order?.orderItems?.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{' '}
                    <span>
                      {item.quantity} X ₹{item.price} ={' '}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </ErrorBoundary>
  );
};

export default OrderDetails;
