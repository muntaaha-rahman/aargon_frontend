import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_CONFIG } from './config';

export interface Client {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientCreateRequest {
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ClientResponse {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    createClient: builder.mutation<ClientResponse, ClientCreateRequest>({
      query: (clientData) => ({
        url: '/clients/',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: ['Client'],
    }),
    getClients: builder.query<Client[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 } = {}) => ({
        url: '/clients/',
        params: { skip, limit },
      }),
      providesTags: ['Client'],
    }),
    updateClientStatus: builder.mutation<
      ClientResponse,
      { clientId: number; active: boolean }
    >({
      query: ({ clientId, active }) => ({
        url: `/clients/${clientId}/status`,
        method: 'PATCH',
        body: { active },
      }),
      invalidatesTags: ['Client'],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetClientsQuery,
  useUpdateClientStatusMutation,
} = clientsApi;