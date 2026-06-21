// src/api/productApi.ts
// Plain async functions that call the backend.
// React Query hooks call these — no Redux dispatch here.

import api from '../axiosInstance';
import type {
  PaginatedProductsResponse,
  ProductResponse,
  ApiResponse,
  Review,
} from '../types';
import type { ProductQueryParams } from '../queryKeys';

// ── Public ────────────────────────────────────────────────────────────────────

export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<PaginatedProductsResponse> {
  const {
    keyword = '',
    page = 1,
    price = [0, 25000],
    category,
    ratings = 0,
  } = params;

  let link = `/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
  if (category) {
    link += `&category=${category}`;
  }

  const { data } = await api.get<PaginatedProductsResponse>(link);
  return data;
}

export async function fetchProductDetails(id: string): Promise<ProductResponse> {
  const { data } = await api.get<ProductResponse>(`/product/${id}`);
  return data;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function fetchAdminProducts(): Promise<ProductResponse[]> {
  const { data } = await api.get<{ success: boolean; products: ProductResponse[] }>(
    '/admin/products'
  );
  return data.products as unknown as ProductResponse[];
}

export async function createProductApi(
  productData: FormData | Record<string, unknown>
): Promise<ApiResponse<unknown>> {
  const { data } = await api.post<ApiResponse<unknown>>(
    '/admin/product/new',
    productData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function updateProductApi(
  id: string,
  productData: FormData | Record<string, unknown>
): Promise<ApiResponse<unknown>> {
  const { data } = await api.put<ApiResponse<unknown>>(
    `/admin/product/${id}`,
    productData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function deleteProductApi(id: string): Promise<ApiResponse<unknown>> {
  const { data } = await api.delete<ApiResponse<unknown>>(`/admin/product/${id}`);
  return data;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const { data } = await api.get<{ success: boolean; reviews: Review[] }>(
    `/reviews?id=${productId}`
  );
  return data.reviews;
}

export async function submitReviewApi(
  reviewData: { productId: string; rating: number; comment: string }
): Promise<ApiResponse<unknown>> {
  const { data } = await api.put<ApiResponse<unknown>>('/review', reviewData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function deleteReviewApi(
  reviewId: string,
  productId: string
): Promise<ApiResponse<unknown>> {
  const { data } = await api.delete<ApiResponse<unknown>>(
    `/reviews?id=${reviewId}&productId=${productId}`
  );
  return data;
}
