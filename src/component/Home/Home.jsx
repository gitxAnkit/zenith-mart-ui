import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ErrorBoundary from "../../ErrorBoundary";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="Zenith Mart" />
      <div className="banner">
        <p>Welcome to Zenith Mart</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <ErrorBoundary>
        <div className="container" id="container">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </ErrorBoundary>
    </>
  );
};

export default Home;
