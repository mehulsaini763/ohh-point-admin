"use client";
import React, { useContext, useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import SimpleLineChart from "../LineChart";
import GradientBarChart from "../BarChart";
import Table from "@/components/Table";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";
import { FaHandsHelping } from "react-icons/fa";
import Card from "../Card";
import BrandDetails from "./BrandDetails";

const BrandsHome = () => {
  const { brands, campaigns } = useContext(MyContext);
  const [brandsData, setBrandsData] = useState([]);
  const [campaignsAssigned, setCampaignsAssigned] = useState(0);
  const headings = ["Name", "Name of POC", "ID", "Email", "Date", ""];
  const [show, setShow] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandCampaigns, setBrandCampaigns] = useState([]);

  const transformBrandsData = (brands) => {
    return brands.map((brand) => ({
      brand: {
        name: brand.brandName || "N/A",
        img: brand.imageUrl || "",
      },
      name: brand.name || "N/A", // Name of the brand (owner's name)
      id: brand.brandId || "N/A", // Brand ID
      email: `${brand.email.slice(0, 10)}...` || "N/A", // Phone number of the brand
      date:
        new Date(
          brand.createdAt.seconds * 1000 + brand.createdAt.nanoseconds / 1000000
        ).toLocaleDateString() || "N/A", // Date of creation, formatted
      //   numberOfCampaigns: brand.campaigns?.length || 0, // Number of campaigns
      button: "Know more", // Button to view more details
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
    const weekdayCounts = brands.reduce((acc, item) => {
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
    setBrandsData(transformedData);

    let ca = 0;
    brands.forEach((brand) => {
      if (brand.campaigns) {
        ca += brand.campaigns.length;
      }
    });
    setCampaignsAssigned(ca);
    console.log(brands);
  }, [brands]);

  const handleShow = (brandId) => {
    const brand = brands.find((b) => b.brandId === brandId);
    setSelectedBrand(brand);
    const cp = campaigns.filter((c) => c.client === brandId);
    setBrandCampaigns(cp);
    setShow(true);
  };

  return (
    <div className="w-full h-full">
      {show && selectedBrand ? (
        <BrandDetails brand={selectedBrand} campaigns={brandCampaigns} />
      ) : (
        <>
          {/* <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
            <GradientBarChart
              head="Brands"
              count={`+${brands.length}`}
              Icon={true}
              darkColor="#B77DC4"
              lightColor="#F7D5FF"
              data={brandsData}
            />
            <SimpleLineChart
              head="Active Brands"
              count={`+${brands.length}`}
              Icon={true}
              data={brandsData}
            />
            <div className=" flex flex-col gap-4 w-[30%] min-w-[18rem]">
              <Card
                head="Campaigns Assigned"
                count={`+${campaigns.length}`}
                Icon={MdOutlineCampaign}
              />
              <Card
                head="Total number of brands"
                count={`+${brands.length}`}
                Icon={PiHandshake}
              />
            </div>
          </div> */}
          <div className=" w-full flex flex-col items-start justify-start lg:px-0 px-1 gap-4  py-5">
            {/* <h3 className=" text-3xl text-oohpoint-grey-400 font-semibold" >Brands</h3> */}
            <DynamicTable
              headings={headings}
              data={transformBrandsData(brands)}
              rowsPerPage={4}
              pagination={true}
              functionn={handleShow}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BrandsHome;
