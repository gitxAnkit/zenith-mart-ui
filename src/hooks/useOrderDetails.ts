// src/hooks/useOrderDetails.ts
// React Query hook for a single order's details.

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchOrderDetailsApi } from '../api/orderApi';

export function useOrderDetails(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id ?? ''),
    queryFn: () => fetchOrderDetailsApi(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
