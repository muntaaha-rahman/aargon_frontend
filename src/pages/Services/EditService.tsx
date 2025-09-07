// src/pages/Services/EditService.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock existing service data
  const mockService = { id, name: "Web Development" };

  const [name, setName] = useState(mockService.name);

  useEffect(() => {
    // TODO: fetch service by id from API
    // setName(fetchedService.name)
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Service:", { id, name });
    // TODO: call API to update service
    navigate("/services");
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-6">Edit Service</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 max-w-md">
        <div>
          <label className="block text-sm font-medium">Service Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700"
          >
            Update Service
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditService;
