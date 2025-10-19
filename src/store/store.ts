import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { clientsApi } from '../api/clientsApi';
import { servicesApi } from '../api/servicesApi';
import { invoiceApi } from '../api/invoiceApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(clientsApi.middleware)
      .concat(servicesApi.middleware)
      .concat(invoiceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;