"use client";
import React, { useContext, useEffect, useState } from "react";
import SprukoCard from "./SprukoCard";
import { MdCampaign, MdOutlineCampaign } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MyContext } from "@/context/MyContext";
import SprukoPieChart from "./SprukoPieChart";
import SprukoMixChart from "./SprukoMixChart";
import dynamic from "next/dynamic";
import DynamicTable from "../NewTable";
import SprukoTable from "./SprukoTable";

const MapLocation = dynamic(() => import("../MapLocation"), {
  ssr: false,
});

const SprukoDashboard = () => {
  const { campaigns, user, vendors, brands, users } = useContext(MyContext);
  const [locations, setLocations] = useState([]);

  function convertTimestampToDate(timestamp) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }

  function getWeekdayName(date) {
    const options = { weekday: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const [totalScansData, setTotalScansData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [totalUsersData, setTotalUsersData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });

  const [totalVendorsData, setTotalVendorsData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });

  const [totalBrandsData, setTotalBrandsData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [uniqueScansData, setUniqueScansData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [campaignsData, setCampaignsData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });
  const [budgetData, setBudgetData] = useState({
    total: 0,
    lineData: [],
    increase: 0,
  });

  useEffect(() => {
    let totalScans = 0,
      uniqueScans = 0,
      budget = 0,
      campaignCount = 0,
      totalUsers = users.length,
      totalVendors = vendors.length,
      totalBrands = brands.length;
    let todayScans = 0,
      todayUniqueScans = 0,
      todayBudget = 0,
      todayCampaigns = 0;

    const scansLineData = {},
      uniqueScansLineData = {},
      campaignsLineData = {},
      budgetLineData = {},
      usersLineData = {},
      vendorsLineData = {},
      brandsLineData = {};

    const today = new Date();

    // Process campaigns
    campaigns.forEach((campaign) => {
      const createdAt = convertTimestampToDate(campaign.createdAt);
      const weekday = getWeekdayName(createdAt);

      const scanCount = campaign.ipAddress ? campaign.ipAddress.length : 0;
      const uniqueScanCount = campaign.locationIp
        ? campaign.locationIp.length
        : 0;

      totalScans += scanCount;
      uniqueScans += uniqueScanCount;

      const campaignBudget = parseInt(campaign.campaignBudget, 10);
      budget += campaignBudget;
      campaignCount++;

      if (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      ) {
        todayScans += scanCount;
        todayUniqueScans += uniqueScanCount;
        todayBudget += campaignBudget;
        todayCampaigns++;
      }

      // Aggregate data by weekday
      scansLineData[weekday] = (scansLineData[weekday] || 0) + scanCount;
      uniqueScansLineData[weekday] =
        (uniqueScansLineData[weekday] || 0) + uniqueScanCount;
      campaignsLineData[weekday] = (campaignsLineData[weekday] || 0) + 1;
      budgetLineData[weekday] = (budgetLineData[weekday] || 0) + campaignBudget;
    });

    // Process users
    users.forEach((user) => {
      const createdAt = convertTimestampToDate(user.createdAt);
      const weekday = getWeekdayName(createdAt);
      usersLineData[weekday] = (usersLineData[weekday] || 0) + 1;
    });

    // Process vendors
    vendors.forEach((vendor) => {
      const createdAt = convertTimestampToDate(vendor.createdAt);
      const weekday = getWeekdayName(createdAt);
      vendorsLineData[weekday] = (vendorsLineData[weekday] || 0) + 1;
    });

    // Process brands
    brands.forEach((brand) => {
      const createdAt = convertTimestampToDate(brand.createdAt);
      const weekday = getWeekdayName(createdAt);
      brandsLineData[weekday] = (brandsLineData[weekday] || 0) + 1;
    });

    // Calculate today's data for users, vendors, and brands
    const todayWeekday = getWeekdayName(today);
    const todayUsers = usersLineData[todayWeekday] || 0;
    const todayVendors = vendorsLineData[todayWeekday] || 0;
    const todayBrands = brandsLineData[todayWeekday] || 0;

    const formatLineData = (dataObj) =>
      Object.entries(dataObj).map(([name, value]) => ({ name, value }));

    // Set the state with aggregated data
    setTotalScansData({
      total: totalScans,
      lineData: formatLineData(scansLineData),
      increase: todayScans,
    });
    setUniqueScansData({
      total: uniqueScans,
      lineData: formatLineData(uniqueScansLineData),
      increase: todayUniqueScans,
    });
    setCampaignsData({
      total: campaignCount,
      lineData: formatLineData(campaignsLineData),
      increase: todayCampaigns,
    });
    setBudgetData({
      total: budget,
      lineData: formatLineData(budgetLineData),
      increase: todayBudget,
    });
    setTotalUsersData({
      total: totalUsers,
      lineData: formatLineData(usersLineData),
      increase: todayUsers,
    });
    setTotalVendorsData({
      total: totalVendors,
      lineData: formatLineData(vendorsLineData),
      increase: todayVendors,
    });
    setTotalBrandsData({
      total: totalBrands,
      lineData: formatLineData(brandsLineData),
      increase: todayBrands,
    });

    const loc = campaigns.map((campaign) => campaign.location);
    const locationData = loc.flat();
    setLocations(locationData);
  }, [campaigns, users, vendors, brands]); // Include users, vendors, and brands in dependencies

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate.seconds * 1000).setHours(0, 0, 0, 0);
    const end = new Date(endDate?.seconds * 1000).setHours(0, 0, 0, 0);

    if (currentDate < start) return "Upcoming";
    else if (currentDate > end) return "Closed";
    return "Active";
  };

  const transformCampaignsData = (campaigns) =>
    campaigns.map((campaign) => ({
      campaign: {
        name: campaign.campaignName || "N/A",
        img: campaign.adCreative || "",
      },
      id: campaign.campaignId || "N/A",
      impressions: campaign.ipAddress?.length || 0,
      startDate:
        new Date(campaign.startDate.seconds * 1000).toLocaleDateString() ||
        "N/A",
      endDate:
        new Date(campaign?.endDate?.seconds * 1000).toLocaleDateString() ||
        "N/A",
      status: getStatus(campaign.startDate, campaign.endDate),
      // budgetAllocated: `Rs. ${campaign.campaignBudget || 0}`,
      qr: `https://user-ooh-point.vercel.app/campaign/${campaign.campaignId}-${user.vendorId}`,
    }));

  return (
    <div className="flex flex-col gap-6 p-6 h-full w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        <SprukoCard
          title="Total Campaigns"
          value={campaignsData.total}
          increase={`+${campaignsData.increase}`}
          color="text-green-500"
          iconColor="text-purple-500"
          Icon={MdCampaign}
          bgColor="bg-purple-100"
          lineData={campaignsData.lineData}
          lineColor="purple"
        />
        <SprukoCard
          title="Total Budget"
          value={`Rs.${budgetData.total}`}
          increase={`+${budgetData.increase}`}
          color="text-green-500"
          iconColor="text-blue-500"
          Icon={AiOutlineStock}
          bgColor="bg-blue-100"
          lineData={budgetData.lineData}
          lineColor="blue"
        />
        <SprukoCard
          title="Total Users"
          value={users.length}
          increase={`+${totalUsersData.increase}`}
          color="text-green-500"
          iconColor="text-purple-500"
          Icon={MdCampaign}
          bgColor="bg-purple-100"
          lineData={totalUsersData.lineData}
          lineColor="purple"
        />
        <SprukoCard
          title="Total Vendors"
          value={vendors.length}
          increase={`+${totalVendorsData.increase}`}
          color="text-green-500"
          iconColor="text-orange-500"
          Icon={MdOutlineCampaign}
          bgColor="bg-orange-100"
          lineData={totalVendorsData.lineData}
          lineColor="orange"
        />
        <SprukoCard
          title="Total Brands"
          value={brands.length}
          increase={`+${totalBrandsData.increase}`}
          color="text-green-500"
          iconColor="text-green-500"
          Icon={IoIosCheckmarkCircleOutline}
          bgColor="bg-green-100"
          lineData={totalBrandsData.lineData}
          lineColor="green"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <SprukoMixChart campaign={campaigns} />
        <div className="flex flex-col gap-6 h-full">
          <MapLocation locations={locations} />
          {/* <SprukoPieChart
          totalScans={totalScansData.total}
          uniqueScans={uniqueScansData.total}
          /> */}
          <div className="flex gap-6">
            <SprukoCard
              title="Total Scans"
              value={totalScansData.total}
              increase={`+${totalScansData.increase}`}
              color="text-green-500"
              iconColor="text-orange-500"
              Icon={MdOutlineCampaign}
              bgColor="bg-orange-100"
              lineData={totalScansData.lineData}
              lineColor="orange"
            />
            <SprukoCard
              title="Unique Scans"
              value={uniqueScansData.total}
              increase={`+${uniqueScansData.increase}`}
              color="text-green-500"
              iconColor="text-green-500"
              Icon={IoIosCheckmarkCircleOutline}
              bgColor="bg-green-100"
              lineData={uniqueScansData.lineData}
              lineColor="green"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-oohpoint-primary-2 text-2xl">Recent Campaigns</p>
        <DynamicTable
          headings={[
            "Campaign Name",
            "Campaign ID",
            "Impressions",
            "Start Date",
            "End Date",
            "Status",
            // "Budget Allocated",
            "QR Code",
          ]}
          data={transformCampaignsData(campaigns)}
          rowsPerPage={4}
          pagination={false}
        />
      </div>
      {/* <SprukoTable /> */}
      <div className="p-0.5" />
    </div>
  );
};

export default SprukoDashboard;