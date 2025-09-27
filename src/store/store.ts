import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { clientsApi } from '../api/clientsApi';
import { servicesApi } from '../api/servicesApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(clientsApi.middleware)
      .concat(servicesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;