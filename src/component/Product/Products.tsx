import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import Pagination from '@mui/material/Pagination';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import MetaData from '../layout/MetaData';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { useProducts } from '../../hooks/useProducts';
import './Products.css';

const categories = [
  'Laptop',
  'Footwear',
  'Bottom',
  'Tops',
  'Attire',
  'Camera',
  'SmartPhones',
];

const Products: React.FC = () => {
  const { keyword } = useParams<{ keyword?: string }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');

  // Slider local UI state
  const [localPrice, setLocalPrice] = useState<number[]>([0, 25000]);
  const [localRatings, setLocalRatings] = useState<number>(0);

  // Debounced state for API calls to prevent spamming server
  const [debouncedPrice, setDebouncedPrice] = useState<number[]>([0, 25000]);
  const [debouncedRatings, setDebouncedRatings] = useState<number>(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(localPrice);
    }, 300);
    return () => clearTimeout(handler);
  }, [localPrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRatings(localRatings);
    }, 300);
    return () => clearTimeout(handler);
  }, [localRatings]);

  // Reset page when search keyword, category, price filter or ratings filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category, debouncedPrice, debouncedRatings]);

  const { data, isLoading, error } = useProducts({
    keyword,
    page: currentPage,
    price: debouncedPrice,
    category: category || undefined,
    ratings: debouncedRatings,
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handlePriceChange = (event: Event, newPrice: number | number[]) => {
    setLocalPrice(newPrice as number[]);
  };

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory === category ? '' : selectedCategory);
  };

  const handleRatingChange = (event: Event, newRating: number | number[]) => {
    setLocalRatings(newRating as number);
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to fetch products');
    }
  }, [error]);

  const products = data?.products;
  const resultPerPage = data?.resultPerPage ?? 8;
  const filteredProductsCount = data?.filteredProductsCount ?? 0;

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main">
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>
          <div className="container">
            <div className="products">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="noProducts">No Products Found</p>
              )}
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
                {categories.map((cat) => (
                  <li
                    className={`category-link ${category === cat ? 'active' : ''}`}
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>

              <fieldset>
                <Typography>Ratings Above</Typography>
                <Slider
                  value={localRatings}
                  onChange={handleRatingChange}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.5}
                />
              </fieldset>
            </div>
          </div>
          {resultPerPage < filteredProductsCount && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
