// src/hooks/useOrderMutations.ts
// useMutation hooks for creating, updating and deleting orders.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { createOrderApi, updateOrderApi, deleteOrderApi } from '../api/orderApi';
import type { Order } from '../types';

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: Partial<Order>) => createOrderApi(order),
    onSuccess: () => {
      // Refresh user's own order list after a new order
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.my() });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderApi(id, { status }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.admin() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrderApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.admin() });
    },
  });
}
