// src/hooks/useStripeApiKey.ts
// React Query hook to fetch the Stripe publishable key.
// Replaces the old stripeSlice + getStripeApiKey thunk.
// Components (Payment) call this directly — no Redux involved.

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { fetchStripeApiKey } from '../api/stripeApi';

export function useStripeApiKey() {
  return useQuery({
    queryKey: queryKeys.stripe.apiKey(),
    queryFn: fetchStripeApiKey,
    staleTime: Infinity, // Stripe key never changes during a session
    retry: false,
  });
}
