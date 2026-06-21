import React, { Fragment, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { useAppDispatch } from '../../redux/hooks';
import ReviewCard from './ReviewCard';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { addToCart } from '../../redux/slices/cartSlice';
import './ProductDetails.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../../ErrorBoundary';
import { useParams } from 'react-router-dom';
import { useProductDetails } from '../../hooks/useProductDetails';
import { useSubmitReview } from '../../hooks/useProductReviews';

const ProductDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useProductDetails(id);
  const product = data?.product;

  const submitReviewMutation = useSubmitReview();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const increaseQuantity = () => {
    if (!product || product.Stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    if (!product || !id) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '/Profile.png',
        stock: product.Stock,
        quantity,
      })
    );
    toast.success('Item Added To Cart');
  };

  const submitReviewToggle = () => {
    setOpen((prev) => !prev);
  };

  const reviewSubmitHandler = () => {
    if (!id) return;
    submitReviewMutation.mutate(
      {
        productId: id,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          toast.success('Review Submitted Successfully');
          setOpen(false);
          setComment('');
          setRating(0);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to submit review');
        },
      }
    );
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load product details');
    }
  }, [error]);

  return (
    <ErrorBoundary>
      <Fragment>
        {isLoading ? (
          <Loader />
        ) : product ? (
          <Fragment>
            <MetaData title={`${product.name}--Zenith Mart`} />
            <div className="ProductDetails">
              <ErrorBoundary>
                <div>
                  <Carousel className="CarouselContainer">
                    {product.images?.map((item, i) => (
                      <img
                        className="CarouselImage"
                        key={item.public_id || i}
                        src={item.url}
                        alt={`${i} Slide`}
                      />
                    ))}
                  </Carousel>
                </div>
              </ErrorBoundary>

              <div>
                <div className="detailsBlock-1">
                  <h2>{product.name}</h2>
                  <p>Product # {product._id}</p>
                </div>
                <div className="detailsBlock-2">
                  <Rating
                    name="read-only"
                    value={product.ratings}
                    precision={0.5}
                    readOnly
                  />
                  <span className="detailsBlock-2-span">
                    {' '}
                    ({product.numOfReviews} Reviews)
                  </span>
                </div>
                <div className="detailsBlock-3">
                  <h1>{`₹${product.price}`}</h1>
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly type="number" value={quantity} />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button
                      disabled={product.Stock < 1}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </button>
                  </div>

                  <p>
                    Status:{' '}
                    <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>
                      {product.Stock < 1 ? 'OutOfStock' : 'InStock'}
                    </b>
                  </p>
                </div>

                <div className="detailsBlock-4">
                  Description : <p>{product.description}</p>
                </div>

                <button onClick={submitReviewToggle} className="submitReview">
                  Submit Review
                </button>
              </div>
            </div>

            <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={submitReviewToggle}
            >
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent className="submitDialog">
                <Rating
                  onChange={(e) => setRating(Number((e.target as HTMLInputElement).value))}
                  value={rating}
                  size="large"
                />

                <textarea
                  className="submitDialogTextArea"
                  cols={30}
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={reviewSubmitHandler}
                  color="primary"
                  disabled={submitReviewMutation.isPending}
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews">
                {product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <p className="noReviews">No Reviews Yet</p>
            )}
          </Fragment>
        ) : (
          <p>Product not found</p>
        )}
      </Fragment>
    </ErrorBoundary>
  );
};

export default ProductDetails;
