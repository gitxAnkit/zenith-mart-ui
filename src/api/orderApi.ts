// src/api/orderApi.ts
// Plain async functions for all order API calls.

import api from '../axiosInstance';
import type { Order, OrderResponse, OrdersResponse } from '../types';

// ── User ──────────────────────────────────────────────────────────────────────

export async function createOrderApi(order: Partial<Order>): Promise<Order> {
  const { data } = await api.post<OrderResponse>('/order/new', order, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data.order;
}

export async function fetchMyOrdersApi(): Promise<Order[]> {
  const { data } = await api.get<OrdersResponse>('/orders/me');
  return data.orders;
}

export async function fetchOrderDetailsApi(id: string): Promise<Order> {
  const { data } = await api.get<OrderResponse>(`/order/${id}`);
  return data.order;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function fetchAllOrdersApi(): Promise<{
  orders: Order[];
  totalAmount: number;
}> {
  const { data } = await api.get<OrdersResponse & { totalAmount: number }>(
    '/admin/orders'
  );
  return { orders: data.orders, totalAmount: data.totalAmount ?? 0 };
}

export async function updateOrderApi(
  id: string,
  order: { status: string }
): Promise<boolean> {
  const { data } = await api.put<{ success: boolean }>(
    `/admin/order/${id}`,
    order,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.success;
}

export async function deleteOrderApi(id: string): Promise<boolean> {
  const { data } = await api.delete<{ success: boolean }>(`/admin/order/${id}`);
  return data.success;
}
