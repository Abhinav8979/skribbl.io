import {
  useDispatch,
  useSelector,
  useStore,
  TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Use these hooks throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
