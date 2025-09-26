// src/pages/Clients/ViewClients.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetClientsQuery, useUpdateClientStatusMutation } from "../../api/clientsApi";

interface Client {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  contactPerson?: string;
  phone?: string;
  createdAt: string;
}

function ViewClients() {
  const { data: clients = [], error, isLoading, refetch } = useGetClientsQuery({});
  const [updateClientStatus] = useUpdateClientStatusMutation();

  const toggleStatus = async (client: Client) => {
    try {
      await updateClientStatus({
        clientId: client.id,
        active: !client.active
      }).unwrap();
      
      // The RTK Query will automatically refetch and update the cache
      refetch();
    } catch (error) {
      console.error('Failed to update client status:', error);
      // You can add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 shadow rounded">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 shadow rounded">
        <div className="text-red-600 text-center">
          Error loading clients. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 shadow rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Clients</h2>
        <Link
          to="/clients/add"
          className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700"
        >
          Add New Client
        </Link>
      </div>

      <table className="min-w-full border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Name</th>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Email</th>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Contact Person</th>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Phone</th>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Status</th>
            <th className="p-3 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Created Date</th>
            <th className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Edit</th>
            <th className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Active / Deactivate</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client: Client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3">{client.name}</td>
              <td className="p-3">{client.email}</td>
              <td className="p-3">{client.contactPerson || "-"}</td>
              <td className="p-3">{client.phone || "-"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    client.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.active ? "active" : "inactive"}
                </span>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              {/* Edit button column */}
              <td className="p-3 text-center">
                <Link
                  to={`/clients/edit/${client.id}`}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </td>
              {/* Toggle button column */}
              <td className="p-3 text-center">
                <button
                  onClick={() => toggleStatus(client)}
                  className={`px-3 py-1 text-sm rounded ${
                    client.active
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {client.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clients found. <Link to="/clients/add" className="text-indigo-600 hover:underline">Add your first client</Link>
        </div>
      )}
    </div>
  );
}

export default ViewClients;