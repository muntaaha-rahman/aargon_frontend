// src/pages/Clients/ViewClients.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

interface Client {
  id: number;
  name: string;
  address: string;
  status: "active" | "inactive";
}

function ViewClients() {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Acme Corp", address: "123 Main St", status: "active" },
    { id: 2, name: "Beta Ltd", address: "456 Market Ave", status: "inactive" },
  ]);

  const toggleStatus = (id: number) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Clients</h2>
      <table className="min-w-full border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Name</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Address</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Status</th>
           <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Edit</th>
           <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Active / Deactive</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2">{client.name}</td>
              <td className="p-2">{client.address}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.status}
                </span>
              </td>
              {/* Edit button column */}
              <td className="p-2 text-center">
                <Link
                  to={`/clients/edit/${client.id}`}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </td>
              {/* Toggle button column */}
              <td className="p-2 text-center">
                <button
                  onClick={() => toggleStatus(client.id)}
                  className={`px-3 py-1 text-sm rounded ${
                    client.status === "active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {client.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewClients;
