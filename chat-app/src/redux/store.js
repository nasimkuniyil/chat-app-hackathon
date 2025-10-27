// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authlSlice';
import menuReducer from './slices/menuSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
  },
});

export default store;