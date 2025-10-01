// src/api/servicesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER_CONFIG } from './config';

export interface Service {
  id: number;
  name: string;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceCreateRequest {
  name: string;
}

export interface ServiceUpdateRequest {
  name?: string;
  active?: boolean;
}

export interface ServiceAssignment {
  id: number;
  client_id: number;
  service_id: number;
  service_start_month: string;
  billing_start_date: string;
  description: string;
  link_capacity: string;
  rate?: number;
  status: boolean;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceAssignmentCreateRequest {
  client_id: number;
  service_id: number;
  service_start_month: string; // YYYY-MM-DD
  billing_start_date: string; // YYYY-MM-DD
  description: string;
  link_capacity: string;
  rate?: number;
}

export interface ServiceAssignmentStatusUpdate {
  status: boolean;
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
  tagTypes: ['Service', 'ServiceAssignment'],
  endpoints: (builder) => ({
    // Service CRUD endpoints
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
    
    getServiceById: builder.query<Service, number>({
      query: (serviceId) => `/services/${serviceId}`,
      providesTags: ['Service'],
    }),
    
    updateService: builder.mutation<Service, { serviceId: number; data: ServiceUpdateRequest }>({
      query: ({ serviceId, data }) => ({
        url: `/services/${serviceId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),
    
    deleteService: builder.mutation<void, number>({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
    
    updateServiceActive: builder.mutation<Service, { serviceId: number; active: boolean }>({
      query: ({ serviceId, active }) => ({
        url: `/services/${serviceId}/active`,
        method: 'PATCH',
        body: { active },
      }),
      invalidatesTags: ['Service'],
    }),

    // Service Assignment endpoints
    createServiceAssignment: builder.mutation<ServiceAssignment, ServiceAssignmentCreateRequest>({
      query: (assignmentData) => ({
        url: '/services/assignments',
        method: 'POST',
        body: assignmentData,
      }),
      invalidatesTags: ['ServiceAssignment'],
    }),
    
    getServiceAssignments: builder.query<ServiceAssignment[], void>({
      query: () => '/services/assignments',
      providesTags: ['ServiceAssignment'],
    }),
    
    updateServiceAssignmentStatus: builder.mutation<
      ServiceAssignment,
      { assignmentId: number; status: boolean }
    >({
      query: ({ assignmentId, status }) => ({
        url: `/services/assignments/${assignmentId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['ServiceAssignment'],
    }),
  }),
});

export const { 
  useCreateServiceMutation, 
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceActiveMutation,
  useCreateServiceAssignmentMutation,
  useGetServiceAssignmentsQuery,
  useUpdateServiceAssignmentStatusMutation
} = servicesApi;