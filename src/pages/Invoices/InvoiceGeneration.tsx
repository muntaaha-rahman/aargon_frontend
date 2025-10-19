import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useGetClientsQuery } from "../../api/clientsApi";
import { useGetInvoicePreviewMutation } from "../../api/servicesApi";
import { useCreateInvoiceMutation } from "../../api/invoiceApi";

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
  proratedAmount: string;
}

const numberToWords = (num: number): string => {
  const units = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  if (num < 10) return units[num];
  return num.toString();
};

const InvoiceGeneration: React.FC = () => {
  const { data: clientsData } = useGetClientsQuery();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [serviceStartMonths, setServiceStartMonths] = useState<Date[]>([]);
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "service", "days", "amount", "description", "linkCapacity", "rate", "proratedAmount",
  ]);

  const [getInvoicePreview, { data: previewData, isLoading: previewLoading }] = useGetInvoicePreviewMutation();
  const [createInvoice] = useCreateInvoiceMutation();

  useEffect(() => {
    if (selectedClient && serviceStartMonths.length > 0) {
      const months = serviceStartMonths.map((m) => m.toISOString().split("T")[0]);
      getInvoicePreview({ client_id: selectedClient.id, months });
    }
  }, [selectedClient, serviceStartMonths]);

  useEffect(() => {
    if (previewData) {
      const newRows = previewData.months.flatMap((month) =>
        month.services.map((srv) => ({
          service: srv.service_name,
          days: srv.prorated_days.toString(),
          amount: srv.prorated_amount.toFixed(2),
          description: srv.description,
          linkCapacity: srv.link_capacity,
          rate: srv.rate?.toString() || "",
          proratedAmount: srv.prorated_amount.toFixed(2),
        }))
      );
      setRows(newRows);
    }
  }, [previewData]);

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

  const generatePDFAndSend = async () => {
    if (!selectedClient || serviceStartMonths.length === 0) {
      alert("Please select a client and at least one month.");
      return;
    }

    const doc = new jsPDF();
    const invoiceNumber = `INV-${Date.now()}`;

    const monthStrings = serviceStartMonths
      .map((m) => m.toLocaleDateString("en-US", { month: "long", year: "numeric" }))
      .join(", ");

    const clientData = [
      ["Invoice Number", invoiceNumber],
      ["Client Name", selectedClient.name],
      ["Email", selectedClient.email || "-"],
      ["Phone", selectedClient.phone || "-"],
      ["Address", selectedClient.address || "-"],
      ["Service Months", monthStrings],
    ];
    (doc as any).autoTable({ head: [["Field", "Value"]], body: clientData, startY: 10 });

    const tableColumns = ["SL.", ...selectedColumns.map((col) => col.toUpperCase())];
    const tableRows = rows.map((row, idx) => [idx + 1, ...selectedColumns.map((col) => (row as any)[col] || "")]);
    (doc as any).autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: (doc as any).lastAutoTable.finalY + 10,
    });

    const total = rows.reduce((sum, row) => sum + parseFloat(row.amount || "0"), 0);
    doc.text(`Total: ${total.toFixed(2)} (${numberToWords(total)})`, 10, (doc as any).lastAutoTable.finalY + 20);

    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], `${invoiceNumber}.pdf`, { type: "application/pdf" });
    doc.save(`${invoiceNumber}.pdf`);

    const formData = new FormData();
    formData.append("client_id", String(selectedClient.id));
    formData.append("months", monthStrings);
    formData.append("file", pdfFile);

    try {
      await createInvoice(formData).unwrap();
      alert("Invoice created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice.");
    }
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

        {selectedClient && (
          <div className="border border-gray-200 p-2 rounded-md space-y-1">
            <p><strong>Email:</strong> {selectedClient.email || "-"}</p>
            <p><strong>Phone:</strong> {selectedClient.phone || "-"}</p>
            <p><strong>Address:</strong> {selectedClient.address || "-"}</p>
          </div>
        )}

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
          <div className="mt-2 flex flex-wrap gap-2">
            {serviceStartMonths.map((month, idx) => (
              <div
                key={idx}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
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

      {previewLoading ? (
        <p className="text-gray-500 text-center py-4">Loading invoice preview...</p>
      ) : rows.length > 0 ? (
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
      ) : (
        <p className="text-gray-500 text-center py-4">
          No data to show. Select client and months.
        </p>
      )}

      <button
        onClick={handleAddRow}
        className="mt-2 bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
      >
        + Add Extra Row
      </button>

      <div className="mt-4">
        <button
          onClick={generatePDFAndSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceGeneration;