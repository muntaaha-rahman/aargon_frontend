// src/pages/Clients/AddClient.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateClientMutation } from "../../api/clientsApi";

function AddClient() {
  const navigate = useNavigate();
  const [createClient, { isLoading, error }] = useCreateClientMutation();

  const [form, setForm] = useState({
    name: "",
    address: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createClient(form).unwrap();
      navigate("/clients"); // redirect to list after adding
    } catch (err) {
      // Error handling is already available in the `error` state
      console.error("Failed to create client:", err);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-6">Add Client</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error creating client. Please try again.
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium">Client Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Client Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Person</label>
          <input
            type="text"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="col-span-2 flex justify-start">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding Client...' : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClient;