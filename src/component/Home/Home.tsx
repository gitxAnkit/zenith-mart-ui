import React, { useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import { toast } from 'react-toastify';
import './Home.css';
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import { useProducts } from '../../hooks/useProducts';
import Loader from '../layout/Loader/Loader';
import ErrorBoundary from '../../ErrorBoundary';

const Home: React.FC = () => {
  const { data, isLoading, error } = useProducts();

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to fetch products');
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  const products = data?.products;

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
