"use client";
import React, { useContext, useEffect, useState } from "react";
import Card from "../../Card";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import SimpleLineChart from "../../LineChart";
import SpiderChart from "../../SpiderChart";
import GradientBarChart from "../../BarChart";
import Table from "@/components/Table";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";
import { FaHandsHelping } from "react-icons/fa";

const Home = () => {
  const { vendors } = useContext(MyContext);
  const [vendorsData, setVendorsData] = useState([]);
  const [campaignsAssigned, setCampaignsAssigned] = useState(0);
  const headings = [
    "Name",
    "ID",
    "Phone Number",
    "Date",
    "Number of Campaigns",
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
    }));
  };

  function getWeekdayName(dateString) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
      console.error(`Invalid date string: ${dateString}`);
      return "Invalid Date"; // Handle this case as needed
    }

    const options = { weekday: "short" }; // "short" will give Mon, Tue, etc.
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function convertTimestampToDate(timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  useEffect(() => {
    const weekdayCounts = vendors.reduce((acc, item) => {
      const date = convertTimestampToDate(item?.createdAt);
      const weekday = getWeekdayName(date);

      // Skip invalid dates
      if (weekday !== "Invalid Date") {
        acc[weekday] = (acc[weekday] || 0) + 1;
      }

      return acc;
    }, {});

    const transformedData = Object.entries(weekdayCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    setVendorsData(transformedData);

    let ca = 0;
    vendors.forEach((vendor) => {
      if (vendor.campaigns) {
        ca += vendor.campaigns.length;
      }
    });
    setCampaignsAssigned(ca);
  }, [vendors]);

  return (
    <div className="w-full h-full flex-col">
      <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
        <GradientBarChart
          head="Vendor Registration"
          count={`+${vendors.length}`}
          Icon={true}
          darkColor="#B77DC4"
          lightColor="#F7D5FF"
          data={vendorsData}
        />
        <SimpleLineChart
          head="Active Vendors"
          count={`+${vendors.length}`}
          Icon={true}
          data={vendorsData}
        />
        <div className=" flex flex-col gap-4 w-[30%] min-w-[18rem]">
          {/* <Card
            head="Pending Approvals"
            count="60"
            Icon={IoIosCheckmarkCircleOutline}
          /> */}
          <Card
            head="Campaigns Assigned"
            count={`+${campaignsAssigned}`}
            Icon={MdOutlineCampaign}
          />
          <Card
            head="Total number of vendors"
            count={`+${vendors.length}`}
            Icon={PiHandshake}
          />
        </div>
      </div>
      {/* <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2 mt-5">
        <GradientBarChart
          head="Vendor Registration"
          count="+24 (this month)"
          Icon={true}
          darkColor="#B77DC4"
          lightColor="#F7D5FF"
        />
        <SpiderChart head="Vendors" />
        <SimpleLineChart
          head="Active Vendors"
          count="65748"
          Icon={true}
        />
      </div> */}
      {/* <div className="mt-5 w-full ">
        <div className="flex w-full bg-oohpoint-grey-100 justify-between px-10 py-4 rounded-lg max-md:flex-col">
          <div className="flex gap-4">
            {[0, 1, 2, 3, 4].map((item) => (
              <div
                className={`w-7 h-7 rounded-full bg-oohpoint-grey-300`}
              ></div>
            ))}
          </div>
          <h2 className="text-3xl font-extrabold text-oohpoint-tertiary-1">Signup</h2>
        </div>
      </div> */}
      <div className=" w-full flex flex-col items-start justify-start lg:px-0 px-1 gap-4 mt-10 py-5">
        {/* <CampaignTable data={campaigns} /> */}
        <h3 className=" text-3xl text-oohpoint-grey-400 font-semibold">
          Recent Vendors
        </h3>
        <DynamicTable
          headings={headings}
          data={transformVendorsData(vendors)}
          rowsPerPage={8}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Home;
