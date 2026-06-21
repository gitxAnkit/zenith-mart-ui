// src/hooks/useUsers.ts
// React Query hooks for admin user management:
// - list all users, single user details
// - update / delete mutations with cache invalidation

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../redux/hooks';
import { queryKeys } from '../queryKeys';
import {
  fetchAllUsersApi,
  fetchUserDetailsApi,
  updateUserApi,
  deleteUserApi,
} from '../api/userApi';
import {
  allUsersRequest, allUsersSuccess, allUsersFail,
  userDetailsRequest, userDetailsSuccess, userDetailsFail,
  updateUserRequest, updateUserSuccess, updateUserFail, updateUserReset,
  deleteUserRequest, deleteUserSuccess, deleteUserFail, deleteUserReset,
} from '../redux/slices/userSlice';
import { useEffect } from 'react';

type ApiError = { response?: { data?: { message?: string } }; message?: string };
const getMsg = (err: unknown) =>
  (err as ApiError)?.response?.data?.message ?? (err as Error)?.message ?? 'Something went wrong';

// ── All Users ─────────────────────────────────────────────────────────────────

export function useAllUsers() {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: queryKeys.user.all(),
    queryFn: () => {
      dispatch(allUsersRequest());
      return fetchAllUsersApi();
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) dispatch(allUsersSuccess(query.data));
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) dispatch(allUsersFail(getMsg(query.error)));
  }, [query.isError, query.error, dispatch]);

  return query;
}

// ── User Details ──────────────────────────────────────────────────────────────

export function useUserDetails(id: string | undefined) {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: queryKeys.user.detail(id ?? ''),
    queryFn: () => {
      dispatch(userDetailsRequest());
      return fetchUserDetailsApi(id!);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) dispatch(userDetailsSuccess(query.data));
  }, [query.isSuccess, query.data, dispatch]);

  useEffect(() => {
    if (query.isError) dispatch(userDetailsFail(getMsg(query.error)));
  }, [query.isError, query.error, dispatch]);

  return query;
}

// ── Update User ───────────────────────────────────────────────────────────────

export function useUpdateUser() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: { name: string; email: string; role: string };
    }) => {
      dispatch(updateUserRequest());
      return updateUserApi(id, userData);
    },
    onSuccess: (success, { id }) => {
      dispatch(updateUserSuccess(success));
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(id) });
    },
    onError: (err: unknown) => {
      dispatch(updateUserFail(getMsg(err)));
    },
    onSettled: () => {
      dispatch(updateUserReset());
    },
  });
}

// ── Delete User ───────────────────────────────────────────────────────────────

export function useDeleteUser() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      dispatch(deleteUserRequest());
      return deleteUserApi(id);
    },
    onSuccess: (data) => {
      dispatch(deleteUserSuccess(data));
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all() });
    },
    onError: (err: unknown) => {
      dispatch(deleteUserFail(getMsg(err)));
    },
    onSettled: () => {
      dispatch(deleteUserReset());
    },
  });
}
