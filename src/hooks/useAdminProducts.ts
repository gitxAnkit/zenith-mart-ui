// src/hooks/useAdminProducts.ts
// React Query hooks for admin product management:
// - list all products
// - create / update / delete mutations with automatic cache invalidation

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import {
  fetchAdminProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '../api/productApi';

export function useAdminProducts() {
  return useQuery({
    queryKey: queryKeys.products.admin(),
    queryFn: fetchAdminProducts,
    staleTime: 1000 * 60,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: FormData | Record<string, unknown>) =>
      createProductApi(productData),
    onSuccess: () => {
      // Invalidate both admin list and public list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.admin() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productData,
    }: {
      id: string;
      productData: FormData | Record<string, unknown>;
    }) => updateProductApi(id, productData),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.admin() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.admin() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    },
  });
}
