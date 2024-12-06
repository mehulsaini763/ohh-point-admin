import React, { useState } from "react";
import Table from "@/components/Table";
import VendDetails from "./VendDetails";
import DynamicTable from "@/components/NewTable";
import { X } from "lucide-react";
import Modal from "@/components/Modal";

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
      <Modal className={'overflow-y-auto'} open={open} close={() => setOpen(false)}>
        <VendDetails vendor={data} handleBack={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default VendorsDetails;
