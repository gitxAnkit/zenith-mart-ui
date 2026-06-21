import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import SideBar from './Sidebar';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { useUpdateOrder } from '../../hooks/useOrderMutations';
import Loader from '../layout/Loader/Loader';
import { toast } from 'react-toastify';
import './ProcessOrder.css';
import { AccountTree } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../../ErrorBoundary';

const ProcessOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading: loadingDetails, error: detailsError } = useOrderDetails(id);
  const updateOrderMutation = useUpdateOrder();

  const [status, setStatus] = useState('');

  const updateOrderSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !status) return;

    updateOrderMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success('Order Updated Successfully');
          navigate('/admin/orders');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to update order');
        },
      }
    );
  };

  useEffect(() => {
    if (detailsError) {
      const err = detailsError as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load order details');
    }
  }, [detailsError]);

  const isLoading = loadingDetails || updateOrderMutation.isPending;
  const orderUser = order?.user && typeof order.user === 'object' ? order.user : null;

  return (
    <Fragment>
      <ErrorBoundary>
        <MetaData title="Process Order" />
        <div className="dashboard">
          <SideBar />
          <div className="newProductContainer">
            {isLoading || !order ? (
              <Loader />
            ) : (
              <div
                className="confirmOrderPage"
                style={{
                  display: order.orderStatus === 'Delivered' ? 'block' : 'grid',
                }}
              >
                <div>
                  <div className="confirmshippingArea">
                    <Typography>Shipping Info</Typography>
                    <div className="orderDetailsContainerBox">
                      <div>
                        <p>Name:</p>
                        <span>{orderUser?.name}</span>
                      </div>
                      <div>
                        <p>Phone:</p>
                        <span>
                          {order.shippingInfo && order.shippingInfo.phoneNo}
                        </span>
                      </div>
                      <div>
                        <p>Address:</p>
                        <span>
                          {order.shippingInfo &&
                            `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                        </span>
                      </div>
                    </div>

                    <Typography>Payment</Typography>
                    <div className="orderDetailsContainerBox">
                      <div>
                        <p
                          className={
                            order.paymentInfo &&
                            order.paymentInfo.status === 'succeeded'
                              ? 'greenColor'
                              : 'redColor'
                          }
                        >
                          {order.paymentInfo &&
                          order.paymentInfo.status === 'succeeded'
                            ? 'PAID'
                            : 'NOT PAID'}
                        </p>
                      </div>

                      <div>
                        <p>Amount:</p>
                        <span>{order.pricingInfo?.totalPrice ?? (order as any).totalPrice}</span>
                      </div>
                    </div>

                    <Typography>Order Status</Typography>
                    <div className="orderDetailsContainerBox">
                      <div>
                        <p
                          className={
                            order.orderStatus && order.orderStatus === 'Delivered'
                              ? 'greenColor'
                              : 'redColor'
                          }
                        >
                          {order.orderStatus && order.orderStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="confirmCartItems">
                    <Typography>Your Cart Items:</Typography>
                    <div className="confirmCartItemsContainer">
                      {order.orderItems &&
                        order.orderItems.map((item) => (
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

                <div
                  style={{
                    display: order.orderStatus === 'Delivered' ? 'none' : 'block',
                  }}
                >
                  <form
                    className="updateOrderForm"
                    onSubmit={updateOrderSubmitHandler}
                  >
                    <h1>Process Order</h1>

                    <div>
                      <AccountTree />
                      <select onChange={(e) => setStatus(e.target.value)} value={status} required>
                        <option value="">Choose Status</option>
                        {order.orderStatus === 'Processing' && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {order.orderStatus === 'Shipped' && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <Button
                      id="createProductBtn"
                      type="submit"
                      disabled={isLoading || status === ''}
                    >
                      Process
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </Fragment>
  );
};

export default ProcessOrder;
