// src/hooks/useOrders.ts
// React Query hooks for order listings: user orders and admin all-orders.

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchMyOrdersApi, fetchAllOrdersApi } from '../api/orderApi';

export function useMyOrders() {
  return useQuery({
    queryKey: queryKeys.orders.my(),
    queryFn: fetchMyOrdersApi,
    staleTime: 1000 * 60,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: queryKeys.orders.admin(),
    queryFn: fetchAllOrdersApi,
    staleTime: 1000 * 60,
  });
}
