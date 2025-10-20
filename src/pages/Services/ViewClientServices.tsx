import { useState } from "react";
import { useGetServiceAssignmentsQuery, useUpdateServiceAssignmentStatusMutation } from "../../api/servicesApi";
import { useGetClientsQuery } from "../../api/clientsApi";
import { useGetServicesQuery } from "../../api/servicesApi";

function ViewClientServices() {
  const { data: assignments, isLoading, isError, refetch } = useGetServiceAssignmentsQuery();
  const { data: clients } = useGetClientsQuery({});
  const { data: services } = useGetServicesQuery();
  const [updateStatus] = useUpdateServiceAssignmentStatusMutation();

  const [selectedClient, setSelectedClient] = useState<number>(0);

  const filteredAssignments = assignments?.filter(assignment => 
    selectedClient === 0 || assignment.client_id === selectedClient
  );

  const handleStopService = async (assignmentId: number) => {
    if (window.confirm("Are you sure you want to stop this service?")) {
      try {
        await updateStatus({ assignmentId, status: false }).unwrap();
        alert("Service stopped successfully!");
        refetch();
      } catch (error) {
        alert("Failed to stop service");
      }
    }
  };

  const handleEditService = (assignmentId: number) => {
    alert(`Edit service assignment ${assignmentId}`);
  };

  const getClientName = (clientId: number) => {
    return clients?.find(client => client.id === clientId)?.name || `Client ${clientId}`;
  };

  const getServiceName = (serviceId: number) => {
    return services?.find(service => service.id === serviceId)?.name || `Service ${serviceId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) return <div>Loading services...</div>;
  if (isError) return <div>Failed to load services.</div>;

  return (
    <div className="bg-white p-6 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Client Services</h2>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600">Filter by Client:</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(Number(e.target.value))}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value={0}>All Clients</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full border border-gray-100 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Client</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Service</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Description</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Capacity</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Rate</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Service Start</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Billing Start</th>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-100">Status</th>
            <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Edit</th>
            <th className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-100">Stop</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments?.map((assignment) => (
            <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2">{getClientName(assignment.client_id)}</td>
              <td className="p-2">{getServiceName(assignment.service_id)}</td>
              <td className="p-2">{assignment.description}</td>
              <td className="p-2">{assignment.link_capacity}</td>
              <td className="p-2">{assignment.rate ? `$${assignment.rate}` : 'N/A'}</td>
              <td className="p-2">{formatDate(assignment.service_start_month)}</td>
              <td className="p-2">{formatDate(assignment.billing_start_date)}</td>
              <td className="p-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {assignment.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleEditService(assignment.id)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </td>
              <td className="p-2 text-center">
                {assignment.status && (
                  <button
                    onClick={() => handleStopService(assignment.id)}
                    className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                  >
                    Stop
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewClientServices;