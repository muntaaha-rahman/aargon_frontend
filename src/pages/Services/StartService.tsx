import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import { useGetClientsQuery } from "../../api/clientsApi";
import { useGetServicesQuery, useCreateServiceAssignmentMutation } from "../../api/servicesApi";

registerLocale("en-US", enUS);

interface FlexibleField {
  description: string;
  link_capacity: string;
  rate?: number;
}

export default function StartService() {
  // API Hooks
  const { data: clientsData } = useGetClientsQuery({});
  const { data: servicesData } = useGetServicesQuery();
  const [createAssignment] = useCreateServiceAssignmentMutation();

  // State
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [serviceStartMonth, setServiceStartMonth] = useState(new Date());
  const [useFirstOfMonth, setUseFirstOfMonth] = useState(true);
  const [billingStartDate, setBillingStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [fields, setFields] = useState<FlexibleField[]>([
    { description: "", link_capacity: "", rate: undefined },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default values when data loads
  useEffect(() => {
    if (clientsData && clientsData.length > 0 && selectedClientId === 0) {
      setSelectedClientId(clientsData[0].id);
    }
    if (servicesData && servicesData.length > 0 && selectedServiceId === 0) {
      setSelectedServiceId(servicesData[0].id);
    }
  }, [clientsData, servicesData, selectedClientId, selectedServiceId]);

  useEffect(() => {
    if (useFirstOfMonth) {
      // Set billing date to 1st of service start month
      const firstDay = new Date(serviceStartMonth.getFullYear(), serviceStartMonth.getMonth(), 1);
      setBillingStartDate(firstDay);
    }
  }, [useFirstOfMonth, serviceStartMonth]);

  const handleFieldChange = (
    index: number,
    key: keyof FlexibleField,
    value: string | number
  ) => {
    const newFields = [...fields];
    (newFields[index] as any)[key] = value;
    setFields(newFields);
  };

  const addField = () =>
    setFields([
      ...fields,
      { description: "", link_capacity: "", rate: undefined },
    ]);

  const removeField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !selectedServiceId) {
      alert("Please select both client and service");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format dates without timezone issues
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDate = new Date(serviceStartMonth.getFullYear(), serviceStartMonth.getMonth(), 1);

      // Submit each flexible field as separate service assignment
      const promises = fields.map(field =>
        createAssignment({
          client_id: selectedClientId,
          service_id: selectedServiceId,
          service_start_month: formatDate(startDate),
          billing_start_date: formatDate(billingStartDate),
          description: field.description,
          link_capacity: field.link_capacity,
          rate: field.rate
        }).unwrap()
      );

      await Promise.all(promises);

      alert("Service started successfully!");

      // Reset form
      setFields([{ description: "", link_capacity: "", rate: undefined }]);
      setServiceStartMonth(new Date());
      setBillingStartDate(new Date());

    } catch (error) {
      console.error("Failed to start service:", error);
      alert("Failed to start service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded w-full max-w-[90%] mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-6">Start Service</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Client Select */}
        <div>
          <label className="block text-sm font-medium">Client Name</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            required
          >
            <option value={0}>Select Client</option>
            {clientsData?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        </div>

        {/* Service Select */}
        <div>
          <label className="block text-sm font-medium">Service Name</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            required
          >
            <option value={0}>Select Service</option>
            {servicesData?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Start Month */}
        <div>
          <label className="block text-sm font-medium">Service Start Month</label>
          <DatePicker
            selected={serviceStartMonth}
            onChange={(date: Date | null) => {
              if (date) {
                setServiceStartMonth(date);
                if (useFirstOfMonth) {
                  // Auto-update billing date to 1st of selected month
                  setBillingStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
                }
              }
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            locale="en-US"
            required
          />
        </div>

        {/* Billing Start Date */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useFirstOfMonth"
              checked={useFirstOfMonth}
              onChange={(e) => setUseFirstOfMonth(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useFirstOfMonth" className="text-sm font-medium">
              Use 1st of month as billing date
            </label>
          </div>
          <DatePicker
            selected={billingStartDate}
            onChange={(date: Date | null) => {
              if (date) setBillingStartDate(date);
            }}
            dateFormat="dd/MM/yyyy"
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            disabled={useFirstOfMonth}
            required
            minDate={new Date(serviceStartMonth.getFullYear(), serviceStartMonth.getMonth(), 1)}
            maxDate={new Date(serviceStartMonth.getFullYear(), serviceStartMonth.getMonth() + 1, 0)}
          />
        </div>

        {/* Flexible Fields */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium mb-2">Flexible Fields</h3>
          {fields.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
            >
              <input
                type="text"
                placeholder="Description"
                value={field.description}
                onChange={(e) =>
                  handleFieldChange(index, "description", e.target.value)
                }
                className="border border-gray-200 rounded-md p-2"
                required
              />
              <input
                type="text"
                placeholder="Link Capacity"
                value={field.link_capacity}
                onChange={(e) =>
                  handleFieldChange(index, "link_capacity", e.target.value)
                }
                className="border border-gray-200 rounded-md p-2"
                required
              />
              <input
                type="number"
                placeholder="Rate"
                value={field.rate || ""}
                onChange={(e) =>
                  handleFieldChange(index, "rate", Number(e.target.value))
                }
                className="border border-gray-200 rounded-md p-2"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="mb-2 bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300 w-32"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="mt-2 bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
          >
            Add Field
          </button>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Starting Service..." : "Start Service"}
          </button>
        </div>
      </form>
    </div>
  );
}