import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  authToken: null,
  userId: null,
  loading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { authToken, userId, user } = action.payload;
      state.authToken = authToken;
      state.userId = userId;
      state.user = user;
      state.isAuthenticated = !!authToken;
      state.loading = false;
      
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearAuth: (state) => {
      state.authToken = null;
      state.userId = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;

export default authSlice.reducer;