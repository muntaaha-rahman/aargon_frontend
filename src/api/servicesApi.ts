// src/api/servicesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_CONFIG } from './config';

export interface Service {
  id: number;
  name: string;
  createdAt: string;
}

export interface ServiceCreateRequest {
  name: string;
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    createService: builder.mutation<Service, ServiceCreateRequest>({
      query: (serviceData) => ({
        url: '/services/',
        method: 'POST',
        body: serviceData,
      }),
      invalidatesTags: ['Service'],
    }),
    getServices: builder.query<Service[], void>({
      query: () => '/services/',
      providesTags: ['Service'],
    }),
  }),
});

export const { useCreateServiceMutation, useGetServicesQuery } = servicesApi;
