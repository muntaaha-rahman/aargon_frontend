// src/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_CONFIG } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;  // Changed from 'token' to 'access_token'
  refresh_token: string;
  token_type: string;
  user: {
    id: number;         // Changed from string to number
    email: string;
    name: string;
    role: string;
    created_at: string;
  };
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_CONFIG.BASE_URL}/auth`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query<UserInfo, void>({
      query: () => '/me',
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;