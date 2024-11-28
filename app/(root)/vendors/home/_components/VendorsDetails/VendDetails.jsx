"use client";
import React, { useContext, useEffect, useState } from "react";
import VendorsCard from "./VendorsCard";
import VendorsCard2 from "./VendorsCard2";
import VendorsCard3 from "./VendorsCard3";
import VendorsCard4 from "./VendorsCard4";
import VendorDashboard from "../VendorDashboard";
import { MyContext } from "@/context/MyContext";

const VendDetails = ({ vendor }) => {
  console.log(vendor);

  const { campaigns } = useContext(MyContext);

  const [vendorCampaigns, setVendorCampaigns] = useState([]);
  useEffect(() => {
    const data = campaigns.filter((c) =>
      c.vendors?.some((ve) => ve.vendorId === vendor.vid)
    );
    setVendorCampaigns(data);
    console.log(data);
  }, [campaigns, vendor]);

  return (
    <div className="bg-oohpoint-grey-200 p-8 overflow-y-auto rounded-lg grid md:grid-cols-4 gap-6 h-full">
      {/* Profile Section */}
      <div className="col-span-full w-full bg-white flex justify-between px-10 py-5 rounded-xl">
        <div>
          <h2 className="text-oohpoint-primary-1 text-3xl">
            Meet {vendor.ownerName}!
          </h2>
          <p>ID - {vendor.vid}</p>
        </div>
        <div>
          <img src="/assets/img.png" alt="" />
        </div>
      </div>
      <VendorsCard profile={vendor} />
      <VendorsCard4 profile={vendor} />
      {vendor && vendor.campaigns && (
        <VendorsCard3 profile={vendor.campaigns} vendorId={vendor.vendorId} />
      )}
      <VendorDashboard user={vendor} campaigns={vendorCampaigns} />
    
    </div>
  );
};

export default VendDetails;
