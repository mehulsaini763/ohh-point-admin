"use client"
import React, { useContext, useEffect, useState } from "react";
import SimpleLineChart from "./LineChart";
import SimplePieChart from "./PieChart";
import SpiderChart from "./SpiderChart";
import GradientBarChart from "./BarChart";
import Card from "./Card";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import Table from "./Table";
import DonutChart from "./DonutChart";
import dynamic from "next/dynamic";
import StackCard from "./StackCard.jsx/StackCard";
import CustomLineGraph from "./CustomLineGraph";
import { MyContext } from "@/context/MyContext";
import CampaignTable from "./CampaignTable";
import DynamicTable from "./NewTable";

const MapLocation = dynamic(() => import("./MapLocation"), {
  ssr: false, // This will disable server-side rendering for the map
});

const Dashboard = () => {

  const {user, campaigns, vendors, brands, users} = useContext(MyContext)
  const [totalScans, setTotalScans] = useState(0)
  const [uniqueScans, setUniqueScans] = useState(0)
  const [weeklyScans, setWeeklyScans] = useState([])
  const [totalCampaignsData, setTotalCampaignsData] = useState([])
  const [locations, setLocations] = useState([])
  const [budget, setBudget] = useState(0)
  const [average, setAverage] = useState(0)
  const [usersData, setUsersData] = useState([])

// Helper function to get the weekday from a date string
function getWeekdayName(dateString) {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date)) {
    console.error(`Invalid date string: ${dateString}`);
    return "Invalid Date"; // Handle this case as needed
  }

  const options = { weekday: 'short' }; // "short" will give Mon, Tue, etc.
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function convertTimestampToDate(timestamp) {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

  useEffect(() => {
    // calculate total scans
    let total = 0
    let unique = 0
    let bd = 0
    campaigns.forEach(campaign => {
      if (campaign.ipAddress) {
        total += campaign.ipAddress.length
      }
      if (campaign.locationIp) {
        unique += campaign.locationIp.length
      }
      bd += parseInt(campaign.campaignBudget)
    })
    setTotalScans(total)
    setUniqueScans(unique)
    setBudget(bd)
    setAverage(bd/campaigns.length)
    const data = campaigns.map(campaign => campaign.ipAddress)
    const ipData = data.flat()
    const loc = campaigns.map(campaign => campaign.location)
    const locationData = loc.flat()
    setLocations(locationData)
    console.log(ipData)
// Assuming ipData is the array of objects
const weekdayCounts = ipData.reduce((acc, item) => {
  const weekday = getWeekdayName(item?.createdAt);
  
  // Skip invalid dates
  if (weekday !== "Invalid Date") {
    acc[weekday] = (acc[weekday] || 0) + 1;
  }
  
  return acc;
}, {});

const transformedData = Object.entries(weekdayCounts).map(([name, value]) => ({
  name,
  value,
}));
console.log(transformedData)


  setWeeklyScans(transformedData)

  const weekdayCountss = campaigns.reduce((acc, campaign) => {
    const date = convertTimestampToDate(campaign.createdAt);
    const weekday = getWeekdayName(date);
    if (weekday !== "Invalid Date") {
      acc[weekday] = (acc[weekday] || 0) + 1;
    }
     // Increment the count for that day
    return acc;
  }, {});
  
  // Convert the object into an array of objects for easier display
  const transformedDataa = Object.entries(weekdayCountss).map(([name, value]) => ({
    name,
    value,
  }));
  setTotalCampaignsData(transformedDataa)
 
  console.log(users)
  if (!users || users.length === 0) {
    console.log('Users array is empty or undefined.');
  } else {
    const weekdayCountsss = users.reduce((acc, campaign) => {
      // Log the current campaign object and its createdAt field
      console.log('Current campaign:', campaign);
      
      const date = convertTimestampToDate(campaign.createdAt);
      console.log('Converted date:', date);  // Debug: Check what date is returned
      
      if (date === 'Invalid Date' || isNaN(date.getTime())) {
        console.error('Skipping invalid date:', campaign.createdAt);
        return acc; // Skip this iteration if the date is invalid
      }
    
      const weekday = getWeekdayName(date);
      console.log('Weekday:', weekday);  // Debug: Check what weekday is returned
    
      acc[weekday] = (acc[weekday] || 0) + 1; // Increment the count for that day
      return acc;
    }, {});
    
    // Convert the object into an array of objects for easier display
    const transformedDataaa = Object.entries(weekdayCountsss).map(([name, value]) => ({
      name,
      value,
    }));
    
    // Log the transformed data to check the result
    console.log('Transformed data:', transformedDataaa);
  
    setUsersData(transformedDataaa);
  }

  }, [campaigns])

  const transformVendorsData = (vendors) => {
    return vendors.map(vendor => ({
      name: vendor.ownerName || 'N/A',             // Name of the vendor (owner's name)
      id: vendor.vendorId || 'N/A',                // Vendor ID
      phoneNumber: vendor.phoneNumber || 'N/A',    // Phone number of the vendor
      date: new Date(vendor.createdAt.seconds * 1000 + vendor.createdAt.nanoseconds / 1000000).toLocaleDateString() || 'N/A', // Date of creation, formatted
      numberOfCampaigns: vendor.campaigns?.length || 0, // Number of campaigns
    }));
  };


  const headings = ["Name", "ID", "Phone Number", "Date", "Number of Campaigns"]
  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start  mt-2">
      <div className=" w-full flex flex-col items-start justify-center lg:px-8   px-1 py-4 gap-1">
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
          Dashboard
        </h1>
        <p className=" text-oohpoint-tertiary-2 font-medium">
          Welcome back, {user?.name}
        </p>
      </div>
      <div className=" w-full flex flex-col items-start justify-start lg:px-8  px-1 gap-4">
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
         
          {/* <Card
            head="Number of campaigns"
            count={campaigns?.length}
            Icon={MdOutlineCampaign}
          /> */}
          <GradientBarChart
            head="Number of campaigns"
            count={campaigns?.length}
            Icon={true}
            darkColor="#B77DC4"
            lightColor="#F7D5FF"
            data={totalCampaignsData}
          />
        <GradientBarChart
          head="Total Users"
          count={users?.length}
          Icon={true}
          darkColor="#441886"
          lightColor="#E6D6FF"
          data={usersData}
        />
         
           <div className=" flex flex-col gap-4 w-[30%] min-w-[18rem]">
           <Card
            head="Total Brands"
            count={brands.length}
            Icon={IoIosCheckmarkCircleOutline}
          />
          <Card head="Total vendors" count={vendors?.length} Icon={PiHandshake} />
           </div>
        </div>
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          {/* <GradientBarChart
            head="Number of campaigns"
            count={campaigns?.length}
            Icon={true}
            darkColor="#B77DC4"
            lightColor="#F7D5FF"
            data={totalCampaignsData}
          />
          <GradientBarChart
            head="Total Users"
            count={users?.length}
            Icon={true}
            darkColor="#441886"
            lightColor="#E6D6FF"
            data={usersData}
          /> */}
            <DonutChart campaigns={campaigns.length} vendors={vendors.length} users={users.length} />
            <MapLocation locations={locations} />
          <SimpleLineChart
            head="Total Number of scans"
            count={totalScans}
            Icon={true}
            data={weeklyScans}
          />
        </div>
        {/* <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          <SpiderChart head="Vendors" />
          <DonutChart campaigns={campaigns.length} vendors={vendors.length} users={users.length} />
          <MapLocation locations={locations} />
        </div> */}
        {/* <div className="  w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          <StackCard
            head={"07 Sept Approval"}
            count={"Team Payments"}
            Icon={true}
          />
          <SimpleLineChart head="Income Statistics" count="+8%" Icon={true} />
          <CustomLineGraph head="Savings" count="Rs. 7000" Icon={true} />
        </div> */}
      </div>
      <div className=" w-full flex flex-col items-start justify-start lg:px-8 px-1 gap-4 mt-10 py-5">
        {/* <CampaignTable data={campaigns} /> */}
        <h3 className=" text-3xl text-oohpoint-grey-400 font-semibold" >Recent Vendors</h3>
        <DynamicTable headings={headings} data={transformVendorsData(vendors)} rowsPerPage={8} pagination={false} />
      </div>
    </div>
  );
};

export default Dashboard;
