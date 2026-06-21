// src/api/userApi.ts
// Plain async functions for all user / auth API calls.

import api from '../axiosInstance';
import type { User, UserResponse, UsersResponse } from '../types';

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<User> {
  const { data } = await api.post<UserResponse>(
    '/login',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.user;
}

export async function registerApi(userData: FormData): Promise<User> {
  const { data } = await api.post<UserResponse>('/register', userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.user;
}

export async function loadUserApi(): Promise<User> {
  const { data } = await api.get<UserResponse>('/me');
  return data.user;
}

export async function logoutApi(): Promise<void> {
  await api.get('/logout');
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function updateProfileApi(userData: FormData): Promise<boolean> {
  const { data } = await api.put<{ success: boolean }>('/me/update', userData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.success;
}

export async function updatePasswordApi(passwords: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<boolean> {
  const { data } = await api.put<{ success: boolean }>(
    '/password/update',
    passwords,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.success;
}

// ── Password Reset ────────────────────────────────────────────────────────────

export async function forgotPasswordApi(email: string): Promise<string> {
  const { data } = await api.post<{ success: boolean; message: string }>(
    '/password/forgot',
    { email },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.message;
}

export async function resetPasswordApi(
  token: string,
  passwords: { password: string; confirmPassword: string }
): Promise<boolean> {
  const { data } = await api.put<{ success: boolean }>(
    `/password/reset/${token}`,
    passwords,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.success;
}

// ── Admin — Users ─────────────────────────────────────────────────────────────

export async function fetchAllUsersApi(): Promise<User[]> {
  const { data } = await api.get<UsersResponse>('/admin/users');
  return data.users;
}

export async function fetchUserDetailsApi(id: string): Promise<User> {
  const { data } = await api.get<UserResponse>(`/admin/user/${id}`);
  return data.user;
}

export async function updateUserApi(
  id: string,
  userData: { name: string; email: string; role: string }
): Promise<boolean> {
  const { data } = await api.put<{ success: boolean }>(
    `/admin/user/${id}`,
    userData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.success;
}

export async function deleteUserApi(
  id: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `/admin/user/${id}`
  );
  return data;
}
