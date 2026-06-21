// src/queryKeys.ts
// Centralised React Query key factory.
// Always use these instead of raw string arrays to avoid typos and
// enable fine-grained cache invalidation.

export interface ProductQueryParams {
  keyword?: string;
  page?: number;
  price?: [number, number];
  category?: string;
  ratings?: number;
}

export const queryKeys = {
  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    all: () => ['products'] as const,
    list: (params: ProductQueryParams) => ['products', 'list', params] as const,
    admin: () => ['products', 'admin'] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    reviews: (id: string) => ['products', 'reviews', id] as const,
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    all: () => ['orders'] as const,
    my: () => ['orders', 'my'] as const,
    admin: () => ['orders', 'admin'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  user: {
    current: () => ['user', 'current'] as const,
    all: () => ['users', 'all'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  // ── Stripe ────────────────────────────────────────────────────────────────
  stripe: {
    apiKey: () => ['stripe', 'apiKey'] as const,
  },
} as const;
