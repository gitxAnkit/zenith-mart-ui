// src/api/stripeApi.ts
// Plain async functions for Stripe-related API calls.

import api from '../axiosInstance';

export async function fetchStripeApiKey(): Promise<string> {
  const { data } = await api.get<{ success: boolean; stripeApiKey: string }>(
    '/stripeapikey'
  );
  return data.stripeApiKey;
}

export async function processPaymentApi(
  paymentData: { amount: number }
): Promise<{ client_secret: string }> {
  const { data } = await api.post<{ client_secret: string }>(
    '/payment/process',
    paymentData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}
