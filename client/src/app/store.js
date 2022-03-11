import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import serverReducer from '../features/serverSlice';
import channelReducer from '../features/channelSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    server: serverReducer,
    channel: channelReducer,
  },
});
