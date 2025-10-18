import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface InvoiceRow {
  service: string;
  days: string;
  amount: string;
  description: string;
  linkCapacity: string;
  rate: string;
}

const InvoiceGeneration: React.FC = () => {
  // --- NEW PART: Client & Month ---
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [serviceStartMonth, setServiceStartMonth] = useState<Date | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clients"); // replace with your API endpoint
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };
    fetchClients();
  }, []);

  // --- EXISTING PART: Invoice Table ---
  const [rows, setRows] = useState<InvoiceRow[]>([
    {
      service: "Internet",
      days: "30",
      amount: "100",
      description: "High speed",
      linkCapacity: "100 Mbps",
      rate: "10",
    },
  ]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "service",
    "days",
    "amount",
    "description",
    "linkCapacity",
    "rate",
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { service: "", days: "", amount: "", description: "", linkCapacity: "", rate: "" },
    ]);
  };

  const handleChange = (index: number, field: keyof InvoiceRow, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const generatePDF = () => {
    if (!selectedClient || !serviceStartMonth) {
      alert("Please select a client and a month.");
      return;
    }

    const doc = new jsPDF();

    // Add client info
    doc.text(`Invoice for ${selectedClient.name}`, 10, 10);
    const clientData = [
      ["Email", selectedClient.email || "-"],
      ["Phone", selectedClient.phone || "-"],
      ["Address", selectedClient.address || "-"],
      [
        "Service Start Month",
        serviceStartMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      ],
    ];
    (doc as any).autoTable({
      head: [["Field", "Value"]],
      body: clientData,
      startY: 20,
    });

    // Add invoice table
    const tableColumn = selectedColumns.map((col) => col.toUpperCase());
    const tableRows = rows.map((row) =>
      selectedColumns.map((col) => (row as any)[col] || "")
    );

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: (doc as any).lastAutoTable.finalY + 10,
    });

    doc.save("invoice.pdf");
  };

  const columns: { key: keyof InvoiceRow; label: string }[] = [
    { key: "service", label: "Service" },
    { key: "days", label: "Days" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" },
    { key: "linkCapacity", label: "Link Capacity" },
    { key: "rate", label: "Rate" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4">Invoice Generation</h2>

      {/* --- NEW PART: Client & Month Picker --- */}
      <div className="space-y-4">
        {/* Client Selector */}
        <div>
          <label className="block text-sm font-medium">Select Client</label>
          <select
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const client = clients.find((c) => c.id === Number(e.target.value));
              setSelectedClient(client || null);
            }}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            required
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-populated client info */}
        {selectedClient && (
          <div className="border border-gray-200 p-2 rounded-md space-y-1">
            <p><strong>Email:</strong> {selectedClient.email || "-"}</p>
            <p><strong>Phone:</strong> {selectedClient.phone || "-"}</p>
            <p><strong>Address:</strong> {selectedClient.address || "-"}</p>
          </div>
        )}

        {/* Service Start Month */}
        <div>
          <label className="block text-sm font-medium">Service Start Month</label>
          <input
            type="month"
            value={serviceStartMonth ? serviceStartMonth.toISOString().slice(0, 7) : ""}
            onChange={(e) => setServiceStartMonth(new Date(e.target.value))}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            required
          />
        </div>
      </div>

      {/* --- EXISTING TABLE --- */}
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col) => (
              <th key={col.key} className="p-2 border-b border-gray-200">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col.key)}
                    onChange={() => handleColumnToggle(col.key)}
                  />
                  <span>{col.label}</span>
                </label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  <input
                    type="text"
                    value={row[col.key]}
                    onChange={(e) => handleChange(rowIndex, col.key, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddRow}
        className="mt-2 bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
      >
        + Add Extra Row
      </button>

      <div className="mt-4">
        <button
          onClick={generatePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceGeneration;
