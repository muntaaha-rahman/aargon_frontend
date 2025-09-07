// src/pages/Services/ViewServices.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

interface Service {
  id: number;
  name: string;
  status: "active" | "inactive";
}

function ViewServices() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Web Development", status: "active" },
    { id: 2, name: "SEO Optimization", status: "inactive" },
  ]);

  const toggleStatus = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    );
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <table className="min-w-full border border-gray-100 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Name</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Status</th>
            <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Edit</th>
            <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Active / Deactive</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2">{service.name}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    service.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {service.status}
                </span>
              </td>
              {/* Edit button */}
              <td className="p-2 text-center">
                <Link
                  to={`/services/edit/${service.id}`}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </td>
              {/* Toggle button */}
              <td className="p-2 text-center">
                <button
                  onClick={() => toggleStatus(service.id)}
                  className={`px-3 py-1 text-sm rounded ${
                    service.status === "active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {service.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewServices;
