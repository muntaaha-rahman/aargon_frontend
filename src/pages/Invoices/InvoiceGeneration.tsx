import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
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

// Enhanced numberToWords function for Taka
const numberToWords = (num: number): string => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
  if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "");

  return "Very Large Amount";
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

    try {
      const doc = new jsPDF();
      const invoiceNumber = `INV-${Date.now()}`;

      // Fixed: Use valid month format
      const billMonth = serviceStartMonths[0].toLocaleDateString("en-US", {
        month: 'long',
        year: 'numeric'
      }).replace(' ', '/');

      // Company Header
      doc.setFontSize(20);
      doc.setFont("helvetica", 'bold');
      doc.text("ARGON NETWORK LIMITED", 20, 20);
      doc.line(20, 25, 190, 25);
      startY: 65

      // Customer Information
      doc.setFontSize(10);
      doc.setFont("helvetica", 'normal');
      doc.text(`Customer Name: ${selectedClient.name}`, 20, 30);
      doc.text(`Customer Address: ${selectedClient.address || '-'}`, 20, 37);
      doc.text(`Bill Month: ${billMonth}`, 20, 44);
      doc.text("MRC of IT and Maintenance fees are as per given below:", 20, 51);

      // Prepare table data with selected columns only
      const columnLabels: { [key: string]: string } = {
        service: "Service",
        rate: "Rate",
        days: "Days",
        amount: "Amount",
        description: "Description",
        linkCapacity: "Link Capacity",
        proratedAmount: "Prorated Amount"
      };

      const tableHead = ["SL", ...selectedColumns.map(col => columnLabels[col] || col)];

      const tableBody = rows.map((row, idx) => [
        (idx + 1).toString(),
        ...selectedColumns.map(col => {
          const value = (row as any)[col];
          if (col === 'rate' || col === 'amount' || col === 'proratedAmount') {
            return value ? `${parseFloat(value).toLocaleString()}/-` : '-';
          }
          return value || '-';
        })
      ]);

      // Services Table
      autoTable(doc, {
        head: [tableHead],
        body: tableBody,
        startY: 60,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [220, 220, 220] }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Total Amount
      const total = rows.reduce((sum, row) => sum + parseFloat(row.amount || "0"), 0);
      doc.setFont("helvetica", 'bold');
      doc.text(`Total Amount: ${total.toLocaleString()}/-`, 20, finalY);

      // Amount in Words
      const amountInWords = numberToWords(total);
      doc.text(`Amount in Word: ${amountInWords} Taka Only.`, 20, finalY + 7);

      // Terms & Conditions
      doc.setFont("helvetica", 'bold');
      doc.text("Terms & Conditions:", 20, finalY + 20);
      doc.setFont("helvetica", 'normal');

      // Terms & Conditions
      doc.setFont("helvetica", 'bold');
      doc.text("Terms & Conditions:", 20, finalY + 20);
      doc.setFont("helvetica", 'normal');

      let termsY = finalY + 27;

      // First bullet point - "Payment:" bold
      doc.setFont("helvetica", 'bold');
      doc.text("• Payment:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      const paymentText = doc.splitTextToSize("MRC to be paid within the 1st-10th of each calendar month. Failure of payment within due time may cause temporary discontinuation of services.", 140); // Reduced width
      doc.text(paymentText, 45, termsY); // Increased from 35 to 45
      termsY += (paymentText.length * 7);

      // Second bullet point - "Payment Methods:" bold  
      doc.setFont("helvetica", 'bold');
      doc.text("• Payment Methods:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      const paymentMethodsText = doc.splitTextToSize("Payment should be paid on our Bank Account by cash deposit/Online Bank Transfer/Bank Cheque", 140); // Reduced width
      doc.text(paymentMethodsText, 55, termsY); // Increased from 35 to 45
      termsY += (paymentMethodsText.length * 7);

      // Bank Account Details - Bold title
      doc.setFont("helvetica", 'bold');
      doc.text("• Bank Account Details:", 20, termsY);
      termsY += 7;

      // Account details - Labels bold, values normal
      doc.setFont("helvetica", 'bold');
      doc.text("  Account Name:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      doc.text("Argon Network Limited", 60, termsY);
      termsY += 7;

      doc.setFont("helvetica", 'bold');
      doc.text("  Account Number:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      doc.text("214100002325", 60, termsY);
      termsY += 7;

      doc.setFont("helvetica", 'bold');
      doc.text("  Bank Name:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      doc.text("Dutch Bangla Bank Limited", 60, termsY);
      termsY += 7;

      doc.setFont("helvetica", 'bold');
      doc.text("  Branch Name:", 20, termsY);
      doc.setFont("helvetica", 'normal');
      doc.text("Uttarkhan Branch", 60, termsY);
      termsY += 7;


// Footer at bottom with 3 columns
const pageHeight = doc.internal.pageSize.height;
const pageWidth = doc.internal.pageSize.width;
const footerY = pageHeight - 25;

// Column 1: Email (left)
doc.text("ayon@anibd.com", 20, footerY);

// Column 2: Phone (moved more left)
doc.text("01776554466", pageWidth / 3, footerY, { align: 'center' });

// Column 3: Address (right)
doc.text("Nandan Tanijuddin, House:74, Flat: 3/C, Kosaibari", pageWidth - 20, footerY, { align: 'right' });
doc.text("Kalachandpur, Dhakkukhan, Dhaka: 1230", pageWidth - 20, footerY + 7, { align: 'right' });

      // Generate PDF file
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], `${invoiceNumber}.pdf`, { type: "application/pdf" });

      // Save locally
      doc.save(`${invoiceNumber}.pdf`);

      // Prepare form data for API
      const formData = new FormData();
      formData.append("client_id", selectedClient.id.toString());
      formData.append("invoice_number", invoiceNumber);
      formData.append("file", pdfFile);

      // Add months
      const months = serviceStartMonths.map(m => m.toISOString().split('T')[0]);
      formData.append("months", JSON.stringify(months));

      try {
        await createInvoice(formData).unwrap();
        alert("Invoice created successfully!");
      } catch (apiError) {
        console.error("API Error:", apiError);
        alert("PDF was generated, but failed to save to server.");
      }

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF.");
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
      ) : (
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