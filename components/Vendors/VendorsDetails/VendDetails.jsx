"use client"
import React, { useContext, useEffect, useState } from "react";
import VendorsCard from "./VendorsCard";
import VendorsCard2 from "./VendorsCard2";
import VendorsCard3 from "./VendorsCard3";
import VendorsCard4 from "./VendorsCard4";
import VendorDashboard from "../VendorDashboard";
import { MyContext } from "@/context/MyContext";

const VendDetails = ({vendor}) => {
  const {campaigns} = useContext(MyContext)
  const [vendorCampaigns, setVendorCampaigns] = useState([])
  useEffect(() => {
    const data = campaigns.filter((c) => 
      c.vendors?.some((ve) => ve.vendorId === vendor.vid)
    );
    setVendorCampaigns(data);
    console.log(data);
  }, [campaigns, vendor]);
  

  return (
    <div className="w-full pb-8">
      {/* Profile Section */}
      <div className="w-full bg-oohpoint-grey-100 flex justify-between px-10 py-5 rounded-xl">
        <div>
          <h2 className="text-oohpoint-primary-1 text-3xl">Meet {vendor.ownerName}!</h2>
          <p>ID - {vendor.vid}</p>
        </div>
        <div>
          <img src="/assets/img.png" alt="" />
        </div>
      </div>

      <div className="mt-5 w-full grid gap-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        
          <VendorsCard profile={vendor} />
          <VendorsCard4 profile={vendor} />
          {/* <VendorsCard2 profile={vendor} /> */}
          {/* <VendorsCard2 profile={vendor} /> */}
          
      </div>
      <div  className="mt-5 w-full">
      <VendorDashboard user={vendor} campaigns={vendorCampaigns} />
      </div>
        <div  className="mt-5 w-full flex gap-4 max-lg:flex-col">
          { vendor && vendor.campaigns && <VendorsCard3 profile={vendor.campaigns} vendorId={vendor.vendorId} /> }
          {/* { vendor && <VendorsCard3 profile={vendor.campaigns} /> } */}
        </div>

     
    </div>
  );
};

export default VendDetails;
