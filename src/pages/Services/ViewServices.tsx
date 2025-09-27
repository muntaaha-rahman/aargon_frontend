// src/pages/Services/ViewServices.tsx
import { Link } from "react-router-dom";
import { useGetServicesQuery } from "../../api/servicesApi";

function ViewServices() {
  const { data: services, isLoading, isError } = useGetServicesQuery();

  if (isLoading) return <div>Loading services...</div>;
  if (isError) return <div>Failed to load services.</div>;

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <table className="min-w-full border border-gray-100 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Name</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Created At</th>
            <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Edit</th>
          </tr>
        </thead>
        <tbody>
          {services?.map((service) => (
            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2">{service.name}</td>
              <td className="p-2">{new Date(service.createdAt).toLocaleDateString()}</td>
              {/* Edit button */}
              <td className="p-2 text-center">
                <Link
                  to={`/services/edit/${service.id}`}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewServices;
