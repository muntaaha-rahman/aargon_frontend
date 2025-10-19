import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/",
  }),
  endpoints: (builder) => ({
    // Create invoice with FormData (includes PDF file)
    createInvoice: builder.mutation({
      query: (formData) => ({
        url: "invoices/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateInvoiceMutation } = invoiceApi;
