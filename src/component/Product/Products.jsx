import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import debounce from "lodash/debounce";
import "./Products.css";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [localPrice, setLocalPrice] = useState(price);
  const [localRatings, setLocalRatings] = useState(ratings);

  const { products, loading, error, resultPerPage, filteredProductsCount } =
    useSelector((state) => state.products);

  const debouncedGetProduct = useCallback(
    debounce((...args) => dispatch(getProduct(...args)), 300),
    [dispatch]
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePriceChange = (event, newPrice) => {
    setLocalPrice(newPrice);
  };

  const handleCategoryClick = (selectedCategory) => {
    setCategory(selectedCategory === category ? "" : selectedCategory);
  };

  const handleRatingChange = (event, newRating) => {
    setLocalRatings(newRating);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    setPrice(localPrice);
    setRatings(localRatings);
  }, [localPrice, localRatings]);

  useEffect(() => {
    debouncedGetProduct(keyword, currentPage, price, category, ratings);
  }, [debouncedGetProduct, keyword, currentPage, price, category, ratings]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="main">
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>
          <div className="container">
            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>

            <div className="filterBox">
              <Typography>Price</Typography>
              <Slider
                value={localPrice}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={25000}
              />

              <Typography>Categories</Typography>
              <ul className="categoryBox">
                {categories.map((category) => (
                  <li
                    className="category-link"
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>

              <fieldset>
                <Typography>Ratings Above</Typography>
                <Slider
                  value={localRatings}
                  onChange={handleRatingChange}
                  onChangeCommitted={(event, newRating) =>
                    setRatings(newRating)
                  }
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>
          </div>
          {resultPerPage < filteredProductsCount && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredProductsCount / resultPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Products;
