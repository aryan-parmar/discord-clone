import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import serverReducer from '../features/serverSlice';
import channelReducer from '../features/channelSlice';
import activeChatReducer from '../features/activeChatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    server: serverReducer,
    channel: channelReducer,
    active: activeChatReducer
  },
});
