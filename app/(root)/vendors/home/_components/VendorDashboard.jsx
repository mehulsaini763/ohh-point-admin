"use client";
import React, { useEffect, useState } from "react";
import GradientBarChart from "@/components/BarChart";
import Card from "@/components/Card";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Sec1 from "./Sec1";
import { AiOutlineStock } from "react-icons/ai";
import SimpleLineChart from "@/components/LineChart";

const MapLocation = dynamic(() => import("@/components/MapLocation"), {
  ssr: false, // This will disable server-side rendering for the map
});

const VendorDashboard = ({ user, campaigns }) => {
  const router = useRouter();
  //   const {user, campaigns} = useContext(MyContext)
  const [totalScans, setTotalScans] = useState(0);
  const [uniqueScans, setUniqueScans] = useState(0);
  const [weeklyScans, setWeeklyScans] = useState([]);
  const [totalCampaignsData, setTotalCampaignsData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [budget, setBudget] = useState(0);
  const [average, setAverage] = useState(0);

  // Helper function to get the weekday from a date string
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
    // calculate total scans
    let total = 0;
    let unique = 0;
    let bd = 0;
    campaigns.forEach((campaign) => {
      if (campaign.ipAddress) {
        total += campaign.ipAddress.length;
      }
      if (campaign.locationIp) {
        unique += campaign.locationIp.length;
      }
      bd += parseInt(campaign.campaignBudget);
    });
    setTotalScans(total);
    setUniqueScans(unique);
    setBudget(bd);
    setAverage(bd / campaigns.length);
    const data = campaigns.map((campaign) => campaign.ipAddress);
    const ipData = data.flat();
    const loc = campaigns.map((campaign) => campaign.location);
    const locationData = loc.flat();
    setLocations(locationData);
    console.log(ipData);
    // Assuming ipData is the array of objects
    const weekdayCounts = ipData.reduce((acc, item) => {
      const weekday = getWeekdayName(item?.createdAt);

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
    console.log(transformedData);

    setWeeklyScans(transformedData);

    const weekdayCountss = campaigns.reduce((acc, campaign) => {
      const date = convertTimestampToDate(campaign.createdAt);
      const weekday = getWeekdayName(date);
      acc[weekday] = (acc[weekday] || 0) + 1; // Increment the count for that day
      return acc;
    }, {});

    // Convert the object into an array of objects for easier display
    const transformedDataa = Object.entries(weekdayCountss).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
    setTotalCampaignsData(transformedDataa);
    console.log(transformedData);
  }, [campaigns]);

  return (
    <>
      <GradientBarChart
        head="Number of campaigns"
        count={campaigns.length}
        Icon={true}
        darkColor="#441886"
        lightColor="#E6D6FF"
        data={totalCampaignsData}
      />
      {/* <Sec2 Icon={AiOutlineStock} para="Total Budget" img="/money.png" value={`Rs.${budget}`} /> */}
      <SimpleLineChart
        head="Business Growth"
        Icon={true}
        data={weeklyScans}
        count={totalScans}
      />
      <Card
        head="Number of scans"
        count={totalScans}
        Icon={MdOutlineCampaign}
      />
      <Card
        head="Number of Unique scans"
        count={uniqueScans}
        Icon={PiHandshake}
      />
      <MapLocation locations={locations} />
      <Sec1
        p1="CPA"
        c1={campaigns.length}
        c2={`Rs.${budget}`}
        p2="Revenue Generated"
      />
      <Card head="Total Budget" count={`Rs.${budget}`} Icon={AiOutlineStock} />
      <Card
        head="Av. Campaign Value"
        count={`Rs.${average.toFixed(2)}`}
        Icon={AiOutlineStock}
      />
    </>
  );
};

export default VendorDashboard;
