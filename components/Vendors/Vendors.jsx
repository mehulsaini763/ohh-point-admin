"use client";
import React, { useContext, useEffect, useState } from "react";
import Home from "./VendorsHome.jsx/Home";
import VendorsDetails from "./VendorsDetails/VendorsDetails";
import Payment from "./Payments/Payment";
import VerificationAndAprrovals from "./VerificationAndApprovals/VerificationAndApprovals";
import CreateVendor from "./CreateVendor";
import { MyContext } from "@/context/MyContext";
import AssignCampaigns from "./AssignCampaigns";
const Vendors = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [vendor, setVendor] = useState(null);
  const { vendors, setVendors, campaigns, fetchVendors } =
    useContext(MyContext);
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <VendorsDetails vendors={vendors} />;
      case "vendorsDetails":
        return <VendorsDetails vendors={vendors} />;
      case "verificationAndApprovals":
        return (
          <AssignCampaigns
            vendors={vendors}
            setVendors={setVendors}
            campaigns={campaigns}
          />
        );
      // case "Payments":
      //   return <Payment />;
      case "CreateVendor":
        ``;
        return <CreateVendor />;
      default:
        return <Home />;
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filteredVendors = vendors.filter((vendor) =>
      vendor.vendorId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setVendors(filteredVendors);
    if (e.target.value === "") {
      fetchVendors();
    }
  };

  return (
    <div className="bg-oohpoint-grey-200 flex flex-col gap-6 p-6">
      <h1 className="text-oohpoint-grey-500 font-bold text-4xl">Vendors</h1>
      <div className="flex justify-between  w-full max-xl:flex-col max-xl:gap-6">
        <ul className="flex  gap-5 text-oohpoint-grey-300 max-md:flex-col cursor-pointer">
          <li
            className={`cursor-pointer ${
              activeSection === "home" ? "text-oohpoint-tertiary-2" : ""
            }`}
            onClick={() => {
              setActiveSection("home");
            }}
          >
            Home
          </li>
          {/* <li
              className={`cursor-pointer ${
                activeSection === "vendorsDetails"
                  ? "text-oohpoint-tertiary-2"
                  : ""
              }`}
              onClick={() => {
                setActiveSection("vendorsDetails");
              }}
            >
              Vendor Details
            </li> */}
          <li
            className={`cursor-pointer ${
              activeSection === "verificationAndApprovals"
                ? "text-oohpoint-tertiary-2"
                : ""
            }`}
            onClick={() => {
              setActiveSection("verificationAndApprovals");
            }}
          >
            Assign Campaigns
          </li>
       
          <li
            className={`cursor-pointer ${
              activeSection === "CreateVendor" ? "text-oohpoint-tertiary-2" : ""
            }`}
            onClick={() => {
              setActiveSection("CreateVendor");
            }}
          >
            Create Vendor
          </li>
        </ul>
        <div className="flex gap-5 max-md:flex-wrap max-md:gap-4 max-md:mt-3">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-1 rounded-lg"
            value={searchText}
            onChange={(e) => handleSearch(e)}
          />
        </div>
      </div>
      {renderSection()}
    </div>
  );
};

export default Vendors;
