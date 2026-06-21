import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebFont from 'webfontloader';
import Header from './component/layout/Header/Header';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ErrorBoundary from './ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import ProductDetails from './component/Product/ProductDetails';
import './App.css';
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import UserOptions from './component/layout/Header/UserOptions';
import { useAppSelector } from './redux/hooks';
import { useLoadUser } from './hooks/useAuth';
import Profile from './component/User/Profile';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment';
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/Admin/Dashboard';
import ProductList from './component/Admin/ProductList';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import ProductReviews from './component/Admin/ProductReview';
import OrderList from './component/Admin/OrderList';
import ProcessOrder from './component/Admin/ProcessOrder';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import AccessDenied from './component/Route/AccessDenied';
import Contact from './component/Contact/Contact';
import About from './component/About/About';
import NotFound from './component/layout/NotFound/NotFound';
import Loader from './component/layout/Loader/Loader';

// Payment is wrapped with <Elements> inside Payment.tsx itself (uses useStripeApiKey)
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const App: React.FC = () => {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.user);

  // Replaces dispatch(loadUser()) — auto-runs on mount, syncs to Redux
  useLoadUser();

  useEffect(() => {
    WebFont.load({
      google: { families: ['Roboto', 'Droid Sans', 'Chilanka'] },
    });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary>
          <Header />
          {isAuthenticated && user && <UserOptions user={user} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<LoginSignUp />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute isAdmin={false} />}>
              <Route path="/account" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />
              <Route path="/password/update" element={<UpdatePassword />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/order/confirm" element={<ConfirmOrder />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              {/* Payment: stripe key fetched inside Payment.tsx via useStripeApiKey */}
              <Route
                path="/process/payment"
                element={
                  <Elements stripe={loadStripe(import.meta.env.VITE_STRIPE_KEY ?? '')}>
                    <Payment />
                  </Elements>
                }
              />
            </Route>

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute isAdmin={true} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/product" element={<NewProduct />} />
              <Route path="/admin/product/:id" element={<UpdateProduct />} />
              <Route path="/admin/reviews" element={<ProductReviews />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/order/:id" element={<ProcessOrder />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/user/:id" element={<UpdateUser />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </ErrorBoundary>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </HelmetProvider>
  );
};

export default App;
