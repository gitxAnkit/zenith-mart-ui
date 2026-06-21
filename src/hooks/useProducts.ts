// src/hooks/useProducts.ts
// React Query hook for paginated/filtered product listing.

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchProducts } from '../api/productApi';
import type { ProductQueryParams } from '../queryKeys';

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 30, // 30 seconds — products change often
    placeholderData: (prev) => prev, // keeps old data while loading next page
  });
}
