import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";

// suppress TS error if it appears
// @ts-expect-error
registerLocale("en-US", enUS);

interface FlexibleField {
  description: string;
  link_capacity: string;
  rate?: number;
}

export default function StartService() {
  const dummyClients = ["Acme Corp", "Beta Ltd"];
  const dummyServices = ["Web Hosting", "SEO Optimization"];

  const [clientName, setClientName] = useState(dummyClients[0]);
  const [serviceName, setServiceName] = useState(dummyServices[0]);
  const [serviceStartMonth, setServiceStartMonth] = useState(new Date());
  const [billingStartDate, setBillingStartDate] = useState(new Date());
  const [fields, setFields] = useState<FlexibleField[]>([
    { description: "", link_capacity: "", rate: undefined },
  ]);

  const handleFieldChange = (
    index: number,
    key: keyof FlexibleField,
    value: string | number
  ) => {
    const newFields = [...fields];
    newFields[index][key] = value as any;
    setFields(newFields);
  };

  const addField = () =>
    setFields([
      ...fields,
      { description: "", link_capacity: "", rate: undefined },
    ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(
      serviceStartMonth.getFullYear(),
      serviceStartMonth.getMonth(),
      1
    );

    const newService = {
      clientName,
      serviceName,
      startDate: startDate.toISOString().split("T")[0],
      billingStartDate: billingStartDate.toISOString().split("T")[0],
      flexibleFields: fields,
      status: "active",
    };

    console.log("Service Started:", newService);
    alert("Service started! Check console.");
  };

  return (
    <div className="bg-white p-6 shadow rounded w-full max-w-[90%] mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-6">Start Service</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium">Client Name</label>
          <select
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
          >
            {dummyClients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Service Name</label>
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
          >
            {dummyServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Service Start Month</label>
          <DatePicker
            selected={serviceStartMonth}
            onChange={(date: Date) => setServiceStartMonth(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
            locale="en-US"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Billing Start Date</label>
          <DatePicker
            selected={billingStartDate}
            onChange={(date: Date) => setBillingStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="mt-1 block w-full border border-gray-200 rounded-md p-2"
          />
        </div>

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
              />
              <input
                type="text"
                placeholder="Link Capacity"
                value={field.link_capacity}
                onChange={(e) =>
                  handleFieldChange(index, "link_capacity", e.target.value)
                }
                className="border border-gray-200 rounded-md p-2"
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

        <div className="col-span-2 flex justify-start">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Start Service
          </button>
        </div>
      </form>
    </div>
  );
}
