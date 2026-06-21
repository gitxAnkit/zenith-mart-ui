// src/hooks/useProductDetails.ts
// React Query hook for a single product's details.

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchProductDetails } from '../api/productApi';

export function useProductDetails(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ''),
    queryFn: () => fetchProductDetails(id!),
    enabled: Boolean(id),   // don't fetch until we have an ID
    staleTime: 1000 * 60,   // 1 minute
  });
}
