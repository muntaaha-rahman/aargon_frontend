// src/pages/Services/AddService.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddService() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Service:", { name });
    // TODO: call API to save service
    navigate("/services");
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-6">Add Service</h2>
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
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700"
          >
            Save Service
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddService;
