import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ToastMessage } from '../../types';

interface UIState {
  sidebarCollapsed: boolean;
  toasts: ToastMessage[];
  activeFilters: Record<string, unknown>;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  toasts: [],
  activeFilters: {},
};

let toastId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) { state.sidebarCollapsed = action.payload; },
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      state.toasts.push({ ...action.payload, id: String(++toastId) });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<{ key: string; value: unknown }>) {
      state.activeFilters[action.payload.key] = action.payload.value;
    },
    clearFilters(state) { state.activeFilters = {}; },
  },
});

export const { toggleSidebar, setSidebarCollapsed, addToast, removeToast, setFilter, clearFilters } = uiSlice.actions;
export default uiSlice.reducer;
