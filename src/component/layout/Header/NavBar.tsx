import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";
import { useAppSelector } from "@/redux/hooks";
import UserOptions from "./UserOptions";
import { useProducts } from "@/hooks/useProducts";
// import { useProducts } from "../../hooks/useProducts";

const NavBar: React.FC = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce keyword to avoid excessive queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch product suggestions based on debounced search term
  const { data: searchData } = useProducts({
    keyword: debouncedKeyword,
  });

  const products = searchData?.products || [];

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(false);
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <nav className="nav-bar">
      {/* Brand logo / text */}
      <div className="logo-div">
        <Link to="/">Zenith-Mart.</Link>
      </div>

      {/* Navigation Links */}
      <div className="links-div">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>

      {/* Utility Icons */}
      <div className="icons-div">
        {/* Inline Search Bar */}
        <div className="search-container" ref={searchContainerRef}>
          <form className="navbar-search-box" onSubmit={searchSubmitHandler}>
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          {/* Search suggestions dropdown */}
          {showResults && keyword.trim() && (
            <div className="search-results-dropdown">
              {products.length > 0 ? (
                products.slice(0, 6).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="search-result-item"
                    onClick={() => {
                      setShowResults(false);
                      setKeyword("");
                    }}
                  >
                    <img
                      src={product.images?.[0]?.url || "/Profile.png"}
                      alt={product.name}
                    />
                    <div className="result-details">
                      <span className="result-name">{product.name}</span>
                      <span className="result-price">₹{product.price}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-result">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Cart Link */}
        <Link
          to="/cart"
          className="nav-icon cart-icon-container"
          aria-label="Cart"
        >
          <FaShoppingCart />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </Link>

        {/* User Options */}
        {isAuthenticated && user ? (
          <UserOptions user={user} />
        ) : (
          <Link to="/login" className="nav-icon" aria-label="Profile">
            <FaUser />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
