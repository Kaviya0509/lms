import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from '../../types';
import Cookies from 'js-cookie';

const storedUser = localStorage.getItem('admin_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: Cookies.get('admin_token') || localStorage.getItem('admin_token') || null,
  isAuthenticated: !!(Cookies.get('admin_token') || localStorage.getItem('admin_token')),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      Cookies.set('admin_token', action.payload.token, { expires: 7, secure: true, sameSite: 'strict' });
      localStorage.setItem('admin_token', action.payload.token);
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('admin_token');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<Pick<AuthUser, 'name' | 'email' | 'avatar'>>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('admin_user', JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, setLoading, updateProfile } = authSlice.actions;
export default authSlice.reducer;
