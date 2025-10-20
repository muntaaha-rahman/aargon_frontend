import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_CONFIG } from './config';

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || SERVER_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    // Create invoice with FormData
    createInvoice: builder.mutation({
      query: (formData) => ({
        url: "invoices/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Invoice'],
    }),

    // Get all invoices
    getInvoices: builder.query({
      query: () => "invoices/",
      providesTags: ['Invoice'],
    }),

    // Get single invoice
    getInvoice: builder.query({
      query: (invoiceId) => `invoices/${invoiceId}`,
      providesTags: ['Invoice'],
    }),

    // Download invoice PDF
    downloadInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `invoices/${invoiceId}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { 
  useCreateInvoiceMutation, 
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useDownloadInvoiceMutation 
} = invoiceApi;