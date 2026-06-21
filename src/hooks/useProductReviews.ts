// src/hooks/useProductReviews.ts
// React Query hooks for product reviews: fetch, submit, delete.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import {
  fetchProductReviews,
  submitReviewApi,
  deleteReviewApi,
} from '../api/productApi';

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.reviews(productId ?? ''),
    queryFn: () => fetchProductReviews(productId!),
    enabled: Boolean(productId),
    staleTime: 1000 * 30,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: {
      productId: string;
      rating: number;
      comment: string;
    }) => submitReviewApi(reviewData),
    onSuccess: (_data, { productId }) => {
      // Refresh both the review list and product details (rating/numOfReviews)
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.reviews(productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      productId,
    }: {
      reviewId: string;
      productId: string;
    }) => deleteReviewApi(reviewId, productId),
    onSuccess: (_data, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.reviews(productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
    },
  });
}
