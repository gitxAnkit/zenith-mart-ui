import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WebFont from "webfontloader";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ErrorBoundary from "./ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import "./App.css";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.jsx";
import LoginSignUp from "./component/User/LoginSignUp.jsx";
import UserOptions from "./component/layout/Header/UserOptions.jsx";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./component/User/Profile.jsx";
import ProtectedRoute from "./component/Route/ProtectedRoute.jsx";
import { loadUser } from "./actions/userAction.js";
import UpdateProfile from "./component/User/UpdateProfile.jsx";
import UpdatePassword from "./component/User/UpdatePassword.jsx";
import ForgotPassword from "./component/User/ForgotPassword.jsx";
import ResetPassword from "./component/User/ResetPassword.jsx";
import Cart from "./component/Cart/Cart.jsx";
import Shipping from "./component/Cart/Shipping.jsx";
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";
import Payment from "./component/Cart/Payment.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
import MyOrders from "./component/Order/MyOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
import Dashboard from "./component/Admin/Dashboard.jsx";
import ProductList from "./component/Admin/ProductList.jsx";
import NewProduct from "./component/Admin/NewProduct.jsx";
import UpdateProduct from "./component/Admin/UpdateProduct.jsx";
import ProductReviews from "./component/Admin/ProductReview.jsx";
import OrderList from "./component/Admin/OrderList.jsx";
import ProcessOrder from "./component/Admin/ProcessOrder.jsx";
import UsersList from "./component/Admin/UsersList.jsx";
import UpdateUser from "./component/Admin/UpdateUser.jsx";
import AccessDenied from "./component/Route/AccessDenied.jsx";
import Contact from "./component/Contact/Contact.jsx";
import About from "./component/About/About.jsx";
import NotFound from "./component/layout/NotFound/NotFound.jsx";
import Loader from "./component/layout/Loader/Loader.jsx";
import { getStripeApiKey } from "./redux/slices/stripeSlice.js";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { stripeApiKey, loading } = useSelector((state) => state.stripe);
  const [stripePromise, setStripePromise] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    dispatch(loadUser());
    dispatch(getStripeApiKey());
  }, [dispatch]);

  useEffect(() => {
    if (stripeApiKey) {
      setStripePromise(loadStripe(stripeApiKey));
    }
  }, [stripeApiKey]);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  if (loading) {
    return <Loader />;
  }
  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary>
          <Header />
          {isAuthenticated && <UserOptions user={user} />}
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

            {/* Protected Routes */}
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
              {stripePromise && (
                <Route
                  path="/process/payment"
                  element={
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Payment />
                    </Elements>
                  }
                />
              )}
            </Route>
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
