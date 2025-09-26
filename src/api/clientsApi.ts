import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_CONFIG } from './config';

export interface Client {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  contactPerson?: string;
  phone?: string;
  createdAt: string;
}

export interface ClientCreateRequest {
  name: string;
  email: string;
  password: string; // Required field missing in your current version
  contactPerson?: string;
  phone?: string;
}

export interface ClientResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  contactPerson?: string;
  phone?: string;
  createdAt: string;
}

export interface ClientStatusUpdate {
  active: boolean;
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
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    createClient: builder.mutation<ClientResponse, ClientCreateRequest>({
      query: (clientData) => ({
        url: '/clients/',
        method: 'POST',
        body: {
          name: clientData.name,
          email: clientData.email,
          password: clientData.password,
          contact_person: clientData.contactPerson, // Convert to snake_case for backend
          phone: clientData.phone,
        },
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