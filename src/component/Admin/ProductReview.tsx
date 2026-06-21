import React, { Fragment, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './ProductReviews.css';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import SideBar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Delete, Star } from '@mui/icons-material';
import { useProductReviews, useDeleteReview } from '../../hooks/useProductReviews';
import Loader from '../layout/Loader/Loader';

const ProductReviews: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [inputProductId, setInputProductId] = useState(productId || '');

  const isIdValid = inputProductId.length === 24;
  const { data: reviews, isLoading, error } = useProductReviews(isIdValid ? inputProductId : undefined);
  const deleteReviewMutation = useDeleteReview();

  const deleteReviewHandler = (reviewId: string) => {
    deleteReviewMutation.mutate(
      { reviewId, productId: inputProductId },
      {
        onSuccess: () => {
          toast.success('Review Deleted Successfully');
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to delete review');
        },
      }
    );
  };

  const productReviewsSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputProductId.length !== 24) {
      toast.error('Please enter a valid Product ID.');
    }
  };

  useEffect(() => {
    if (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Failed to load reviews');
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Review ID', minWidth: 200, flex: 0.5 },
    {
      field: 'user',
      headerName: 'User',
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      minWidth: 350,
      flex: 1,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      minWidth: 180,
      flex: 0.4,
      cellClassName: (params) => {
        return params.row.rating >= 3 ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => deleteReviewHandler(params.row.id as string)}>
          <Delete />
        </Button>
      ),
    },
  ];

  const rows =
    reviews?.map((item) => ({
      id: item._id,
      rating: item.rating,
      comment: item.comment,
      user: item.name,
    })) || [];

  return (
    <Fragment>
      <MetaData title="ALL REVIEWS - Admin" />
      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
            <div>
              <Star />
              <input
                type="text"
                placeholder="Product ID"
                required
                value={inputProductId}
                onChange={(e) => setInputProductId(e.target.value)}
              />
            </div>
            <Button
              id="createProductBtn"
              type="submit"
              disabled={isLoading || inputProductId === ''}
            >
              Search
            </Button>
          </form>

          {isLoading || deleteReviewMutation.isPending ? (
            <Loader />
          ) : reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
