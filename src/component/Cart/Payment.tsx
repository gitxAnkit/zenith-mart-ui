import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from '../Cart/CheckoutSteps';
import { useAppSelector } from '../../redux/hooks';
import MetaData from '../layout/MetaData';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './Payment.css';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useCreateOrder } from '../../hooks/useOrderMutations';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../ErrorBoundary';
import api from '../../axiosInstance';

const Payment: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const userId = user?._id;
  const orderInfo = userId ? JSON.parse(sessionStorage.getItem(`orderInfo_${userId}`) || '{}') : null;

  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useAppSelector((state) => state.cart);
  const createOrderMutation = useCreateOrder();

  const paymentData = {
    amount: orderInfo ? Math.round(orderInfo.totalPrice * 100) : 0,
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderInfo) {
      toast.error('Order information not found');
      return;
    }

    if (payBtn.current) {
      payBtn.current.disabled = true;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post<{ client_secret: string }>(
        '/payment/process',
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: user?.name,
            email: user?.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: String(shippingInfo.pinCode),
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        if (payBtn.current) {
          payBtn.current.disabled = false;
        }
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          const order = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice: orderInfo.subtotal,
            taxPrice: orderInfo.tax,
            shippingPrice: orderInfo.shippingCharges,
            totalPrice: orderInfo.totalPrice,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
          };

          createOrderMutation.mutate(order as any, {
            onSuccess: () => {
              navigate('/success');
            },
            onError: (err: any) => {
              if (payBtn.current) {
                payBtn.current.disabled = false;
              }
              toast.error(err?.response?.data?.message ?? 'Order creation failed');
            },
          });
        } else {
          toast.error("There's some issue while processing payment");
          if (payBtn.current) {
            payBtn.current.disabled = false;
          }
        }
      }
    } catch (error: any) {
      if (payBtn.current) {
        payBtn.current.disabled = false;
      }
      toast.error(error?.response?.data?.message ?? 'Payment failed');
    }
  };

  return (
    <Fragment>
      <ErrorBoundary>
        <MetaData title="Payment" />
        <CheckoutSteps activeStep={2} />
        <div className="paymentContainer">
          <form className="paymentForm" onSubmit={submitHandler}>
            <Typography>Card Info</Typography>
            <div>
              <CreditCardIcon />
              <CardNumberElement className="paymentInput" />
            </div>
            <div>
              <EventIcon />
              <CardExpiryElement className="paymentInput" />
            </div>
            <div>
              <VpnKeyIcon />
              <CardCvcElement className="paymentInput" />
            </div>

            <input
              type="submit"
              value={`Pay - ₹${orderInfo ? orderInfo.totalPrice : 0}`}
              ref={payBtn}
              className="paymentFormBtn"
              disabled={createOrderMutation.isPending}
            />
          </form>
        </div>
      </ErrorBoundary>
    </Fragment>
  );
};

export default Payment;
