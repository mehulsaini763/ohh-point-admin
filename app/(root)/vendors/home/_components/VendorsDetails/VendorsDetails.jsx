import React, { useState } from "react";
import Table from "@/components/Table";
import VendDetails from "./VendDetails";
import DynamicTable from "@/components/NewTable";
import { X } from "lucide-react";

const VendorsDetails = ({ data }) => {
  const [open, setOpen] = useState(false); // to toggle between table and vendor details

  return (
    <>
      <button
        className="text-purple-700 bg-purple-300 py-1 text-sm px-3 rounded-md hover:scale-95 transition-all"
        onClick={() => setOpen(true)}
      >
        Know More
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-hidden grid place-content-center z-10 p-8">
          <button
            className="absolute top-4 right-4 bg-white shadow-lg p-4 rounded-lg border"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>

          <VendDetails vendor={data} handleBack={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default VendorsDetails;
