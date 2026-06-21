// src/redux/hooks.ts
// Typed versions of useDispatch and useSelector.
// Use these everywhere instead of the plain react-redux hooks.

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Use instead of `useDispatch()` — knows about async thunks */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Use instead of `useSelector()` — automatically infers slice state types */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
