// src/hooks/useAuth.ts
// Auth mutations that also update Redux auth state.
// Using useMutation for login/register/logout/profile updates, and
// useQuery for the initial session load (loadUser).

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useAppDispatch } from '../redux/hooks';
import { queryKeys } from '../queryKeys';
import {
  loginRequest, loginSuccess, loginFail,
  registerUserRequest, registerUserSuccess, registerUserFail,
  loadUserRequest, loadUserSuccess, loadUserFail,
  logoutSuccess, logoutFail,
  updateProfileRequest, updateProfileSuccess, updateProfileFail,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFail,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail,
  resetPasswordRequest, resetPasswordSuccess, resetPasswordFail,
} from '../redux/slices/userSlice';
import {
  loginApi,
  registerApi,
  loadUserApi,
  logoutApi,
  updateProfileApi,
  updatePasswordApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '../api/userApi';

type ApiError = AxiosError<{ message: string }>;
const getMsg = (err: unknown) =>
  (err as ApiError)?.response?.data?.message ?? (err as Error)?.message ?? 'Something went wrong';

// ── Load User (runs automatically on app mount) ───────────────────────────────

export function useLoadUser() {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: loadUserApi,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync result into Redux (v5 removed onSuccess/onError from useQuery)
  useEffect(() => {
    if (query.isPending) {
      dispatch(loadUserRequest());
    }
  }, [query.isPending, dispatch]);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(loadUserSuccess(query.data));
    }
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) {
      dispatch(loadUserFail(getMsg(query.error)));
    }
  }, [query.isError, query.error, dispatch]);

  return query;
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      dispatch(loginRequest());
      return loginApi(email, password);
    },
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
      queryClient.setQueryData(queryKeys.user.current(), user);
    },
    onError: (err: unknown) => {
      dispatch(loginFail(getMsg(err)));
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────

export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: FormData) => {
      dispatch(registerUserRequest());
      return registerApi(userData);
    },
    onSuccess: (user) => {
      dispatch(registerUserSuccess(user));
      queryClient.setQueryData(queryKeys.user.current(), user);
    },
    onError: (err: unknown) => {
      dispatch(registerUserFail(getMsg(err)));
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logoutSuccess());
      queryClient.removeQueries({ queryKey: queryKeys.user.current() });
    },
    onError: (err: unknown) => {
      dispatch(logoutFail(getMsg(err)));
    },
  });
}

// ── Update Profile ────────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: FormData) => {
      dispatch(updateProfileRequest());
      return updateProfileApi(userData);
    },
    onSuccess: (success) => {
      dispatch(updateProfileSuccess(success));
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current() });
    },
    onError: (err: unknown) => {
      dispatch(updateProfileFail(getMsg(err)));
    },
  });
}

// ── Update Password ───────────────────────────────────────────────────────────

export function useUpdatePassword() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (passwords: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      dispatch(updatePasswordRequest());
      return updatePasswordApi(passwords);
    },
    onSuccess: (success) => {
      dispatch(updatePasswordSuccess(success));
    },
    onError: (err: unknown) => {
      dispatch(updatePasswordFail(getMsg(err)));
    },
  });
}

// ── Forgot Password ───────────────────────────────────────────────────────────

export function useForgotPassword() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (email: string) => {
      dispatch(forgotPasswordRequest());
      return forgotPasswordApi(email);
    },
    onSuccess: (message) => {
      dispatch(forgotPasswordSuccess(message));
    },
    onError: (err: unknown) => {
      dispatch(forgotPasswordFail(getMsg(err)));
    },
  });
}

// ── Reset Password ────────────────────────────────────────────────────────────

export function useResetPassword() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({
      token,
      passwords,
    }: {
      token: string;
      passwords: { password: string; confirmPassword: string };
    }) => {
      dispatch(resetPasswordRequest());
      return resetPasswordApi(token, passwords);
    },
    onSuccess: (success) => {
      dispatch(resetPasswordSuccess(success));
    },
    onError: (err: unknown) => {
      dispatch(resetPasswordFail(getMsg(err)));
    },
  });
}
