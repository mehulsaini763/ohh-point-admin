import React, { useState } from "react";
import Table from "@/components/Table";
import VendDetails from "./VendDetails";
import DynamicTable from "@/components/NewTable";

const VendorsDetails = ({ vendors }) => {
  const [show, setShow] = useState(false); // to toggle between table and vendor details
  const [selectedVendor, setSelectedVendor] = useState(null); // to store selected vendor

  const handleShow = (vid) => {
    const vd = vendors.find((v) => v.vendorId === vid); // find the vendor from the list
    setSelectedVendor(vd); // set the selected vendor
    setShow(true); // show the vendor details
  };

  const handleBack = () => {
    setShow(false); // go back to the table
  };

  const headings = [
    "Name",
    "ID",
    "Phone Number",
    "Date",
    "Number of Campaigns",
    "",
  ];
  const transformVendorsData = (vendors) => {
    return vendors.map((vendor) => ({
      vendor: {
        name: vendor.ownerName || "N/A",
        img:
          vendor.shopImage ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      }, // Name of the vendor (owner's name)
      id: vendor.vendorId || "N/A", // Vendor ID
      phoneNumber: vendor.phoneNumber || "N/A", // Phone number of the vendor
      date:
        new Date(
          vendor.createdAt.seconds * 1000 +
            vendor.createdAt.nanoseconds / 1000000
        ).toLocaleDateString() || "N/A", // Date of creation, formatted
      numberOfCampaigns: vendor.campaigns?.length || 0, // Number of campaigns
      button: "Know more", // Button to view more details
    }));
  };

  return (
    <div className="w-full">
      {/* <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <button className="bg-oohpoint-grey-100 px-4 md:px-6 py-2 rounded-lg text-oohpoint-primary-2 w-full md:w-auto">
          Verified
        </button>
        <button className="bg-oohpoint-grey-100 px-4 md:px-6 py-2 rounded-lg text-oohpoint-primary-2 w-full md:w-auto">
          Disabled
        </button>
        <button className="bg-oohpoint-grey-100 px-4 md:px-6 py-2 rounded-lg text-oohpoint-primary-2 w-full md:w-auto">
          Unverified
        </button>
      </div> */}

      <div className="w-full mt-5">
        {show && selectedVendor ? (
          <VendDetails vendor={selectedVendor} handleBack={handleBack} />
        ) : (
          <DynamicTable
            data={transformVendorsData(vendors)}
            pagination={true}
            rowsPerPage={4}
            functionn={handleShow}
            isShow={true}
            headings={headings}
          />
        )}
      </div>
    </div>
  );
};

export default VendorsDetails;
