import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGetClientsQuery } from "../../api/clientsApi"; // Adjust path
import { useGetInvoicePreviewMutation } from "../../api/servicesApi"; // Fixed import

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
  proratedAmount: string; // New field
}

const InvoiceGeneration: React.FC = () => {
  // --- Client & Multi-Month State ---
  const { data: clientsData } = useGetClientsQuery();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [serviceStartMonths, setServiceStartMonths] = useState<Date[]>([]);

  // Invoice rows state
  const [rows, setRows] = useState<InvoiceRow[]>([
    { service: "", days: "", amount: "", description: "", linkCapacity: "", rate: "", proratedAmount: "" },
  ]);

  // Columns selection
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "service",
    "days",
    "amount",
    "description",
    "linkCapacity",
    "rate",
    "proratedAmount",
  ]);

  // Invoice preview mutation
  const [getInvoicePreview] = useGetInvoicePreviewMutation();

  // Auto-fetch invoice preview when client or months change
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!selectedClient || serviceStartMonths.length === 0) return;

      try {
        const monthsStr = serviceStartMonths.map(
          (m) => `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-01`
        );

        const response = await getInvoicePreview({
          client_id: selectedClient.id,
          months: monthsStr,
        }).unwrap();

        if (!response.months || response.months.length === 0) {
          setRows([
            { service: "", days: "", amount: "", description: "", linkCapacity: "", rate: "", proratedAmount: "" },
          ]);
        } else {
          const invoiceRows: InvoiceRow[] = [];
          response.months.forEach((month) => {
            month.services.forEach((service) => {
              invoiceRows.push({
                service: service.service_name,
                days: service.prorated_days.toString(),
                amount: service.prorated_amount.toFixed(2),
                description: service.description,
                linkCapacity: service.link_capacity,
                rate: service.rate?.toFixed(2) || "",
                proratedAmount: service.prorated_amount.toFixed(2),
              });
            });
          });
          setRows(invoiceRows.length > 0 ? invoiceRows : [
            { service: "", days: "", amount: "", description: "", linkCapacity: "", rate: "", proratedAmount: "" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch invoice preview", err);
      }
    };

    fetchInvoice();
  }, [selectedClient, serviceStartMonths, getInvoicePreview]);

  // --- Handlers ---
  const handleAddRow = () => {
    setRows([
      ...rows,
      { service: "", days: "", amount: "", description: "", linkCapacity: "", rate: "", proratedAmount: "" },
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
    if (!selectedClient || serviceStartMonths.length === 0) {
      alert("Please select a client and at least one month.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Invoice for ${selectedClient.name}`, 10, 10);

    const monthStrings = serviceStartMonths
      .map((m) => m.toLocaleDateString("en-US", { month: "long", year: "numeric" }))
      .join(", ");

    const clientData = [
      ["Email", selectedClient.email || "-"],
      ["Phone", selectedClient.phone || "-"],
      ["Address", selectedClient.address || "-"],
      ["Service Start Months", monthStrings],
    ];

    (doc as any).autoTable({
      head: [["Field", "Value"]],
      body: clientData,
      startY: 20,
    });

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
    { key: "proratedAmount", label: "Prorated Amount" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4">Invoice Generation</h2>

      {/* Client Selector */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Client</label>
          <select
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const client = clientsData?.find((c) => c.id === Number(e.target.value));
              setSelectedClient(client || null);
            }}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
          >
            <option value="">-- Select Client --</option>
            {clientsData?.map((client) => (
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

        {/* Multi-Month Picker */}
        <div>
          <label className="block text-sm font-medium">Select Service Months</label>
          <DatePicker
            selected={null}
            onChange={(date: Date) => {
              if (date && !serviceStartMonths.find((d) => d.getTime() === date.getTime())) {
                setServiceStartMonths([...serviceStartMonths, date]);
              }
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            placeholderText="Select a month"
          />

          {/* Display selected months as tags */}
          <div className="mt-2 flex flex-wrap gap-2">
            {serviceStartMonths.map((month, idx) => (
              <div
                key={idx}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>
                  {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setServiceStartMonths(serviceStartMonths.filter((_, i) => i !== idx))
                  }
                  className="text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
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
