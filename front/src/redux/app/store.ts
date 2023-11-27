import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import authReducer from '../slices/auth/authSlice'
import postReducer from '../slices/post/postSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
