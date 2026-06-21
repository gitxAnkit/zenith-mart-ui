import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaUndo, FaStar } from "react-icons/fa";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { useProducts } from "../../hooks/useProducts";
import Loader from "../layout/Loader/Loader";
import ErrorBoundary from "../../ErrorBoundary";
import TrustCard from "./TrustCard";

const Home: React.FC = () => {
  const { data, isLoading, error } = useProducts();
  const featuredSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to fetch products");
    }
  }, [error]);

  const handleScrollToProducts = () => {
    featuredSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return <Loader />;
  }

  const products = data?.products;

  return (
    <>
      <MetaData title="Zenith Mart" />
      
      {/* Hero Section */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-tagline">Premium Shopping Experience</span>
          <h1 className="hero-heading">
            Discover Premium Products <br />
            For Every Lifestyle
          </h1>
          <p className="hero-subtitle">
            Electronics, Fashion, Accessories and Smart Devices curated for modern living.
          </p>
          <div className="hero-ctas">
            <button className="cta-btn primary-cta" onClick={handleScrollToProducts}>
              Shop Now
            </button>
            <Link to="/products" className="cta-btn secondary-cta">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <TrustCard
            icon={FaTruck}
            title="Free Shipping"
            description="On all orders above ₹999"
          />
          <TrustCard
            icon={FaShieldAlt}
            title="Secure Payments"
            description="100% protected checkout"
          />
          <TrustCard
            icon={FaUndo}
            title="Easy Returns"
            description="30-day money-back guarantee"
          />
          <TrustCard
            icon={FaStar}
            title="Premium Quality"
            description="Certified authentic products"
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section" ref={featuredSectionRef}>
        <div className="section-header">
          <h2 className="homeHeading">Featured Products</h2>
          <p className="section-subtitle">
            Handpicked products chosen for quality and value.
          </p>
        </div>
        <ErrorBoundary>
          <div className="container" id="container">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </ErrorBoundary>
      </section>
    </>
  );
};

export default Home;
