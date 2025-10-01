import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface InvoiceRow {
  service: string;
  days: string;
  amount: string;
  description: string;
  linkCapacity: string;
  rate: string;
}

const InvoiceGeneration: React.FC = () => {
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
    const doc = new jsPDF();
    const tableColumn = selectedColumns.map((col) => col.toUpperCase());
    const tableRows = rows.map((row) =>
      selectedColumns.map((col) => (row as any)[col] || "")
    );

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Invoice Generation</h2>
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
                    onChange={(e) =>
                      handleChange(rowIndex, col.key, e.target.value)
                    }
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
