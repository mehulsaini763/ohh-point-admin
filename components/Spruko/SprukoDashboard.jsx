"use client";
import React, { useContext, useEffect, useState } from "react";
import SprukoCard from "./SprukoCard";
import { MdCampaign, MdOutlineCampaign } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MyContext } from "@/context/MyContext";
import SprukoMixChart from "./SprukoMixChart";
import dynamic from "next/dynamic";
import QRCodeGenerator from "../QRCode";
import CampaignDetails from "@/components/CampaignDetails";
import moment from "moment";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const MapLocation = dynamic(
  () => import("@/app/(root)/_components/MapLocation"),
  {
    ssr: false,
  }
);

const SprukoDashboard = () => {
  const { campaigns, user, vendors, brands, users } = useContext(MyContext);
  const [locations, setLocations] = useState([]);

  function convertTimestampToDate(tmstmp) {
    return new Date((tmstmp?.seconds || 1) * 1000 + (tmstmp?.nanoseconds || 1) / 1000000);
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
    const currentDate = new Date().setHours(0, 0, 0, 0); // Current date without time
    const start = new Date(startDate.seconds * 1000).setHours(0, 0, 0, 0); // Start date
    const end = new Date(endDate.seconds * 1000).setHours(0, 0, 0, 0); // End date

    if (currentDate < start) {
      return (
        <div className="text-sm uppercase py-1 px-2 bg-yellow-300 text-yellow-700 rounded-md w-fit font-semibold">
          Upcoming
        </div>
      ); // Before start date
    } else if (currentDate > end) {
      return (
        <div className="text-sm uppercase py-1 px-2 bg-neutral-300 text-neutral-700 rounded-md w-fit font-semibold">
          Closed
        </div>
      ); // After end date
    } else {
      return (
        <div className="text-sm uppercase py-1 px-2 bg-green-300 text-green-700 rounded-md w-fit font-semibold">
          Active
        </div>
      ); // Between start and end dates
    }
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    { accessorKey: "id", header: <div className="text-left">campaign id</div> },
    {
      accessorKey: "campaignName",
      header: <div className="text-left">campaign name</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original?.adCreative || ""}
            width={32}
            height={32}
            alt="img"
          />
          {row.getValue("campaignName") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "impressions",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("ipAddress")?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "start Date",
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("startDate")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: "end Date",
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("endDate")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: <div className="text-right">status</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          {getStatus(row.getValue("startDate"), row.getValue("endDate"))}
        </div>
      ),
    },
    {
      accessorKey: "qr-code",
      header: "QR CODE",
      cell: ({ row }) => (
        <QRCodeGenerator
          value={`https://user-ooh-point.vercel.app/campaign/${row.original.campaignId}-${user.vendorId}`}
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <CampaignDetails campaign={row.original} />,
    },
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 p-4 md:p-6 w-full">
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
      <SprukoMixChart campaign={campaigns} />
      <MapLocation locations={locations} />
      {/* <SprukoPieChart
          totalScans={totalScansData.total}
          uniqueScans={uniqueScansData.total}
          /> */}
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
      {campaigns.length == 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md h-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="col-span-full bg-white w-full h-full rounded-lg overflow-hidden">
          <p className="text-oohpoint-primary-2 p-4 text-xl border-b">
            Recent Campaigns
          </p>
          <div className="w-full overflow-x-auto">
            <table className="w-full h-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => (
                      <th
                        key={header.id}
                        className={
                          "uppercase p-4 border-b font-medium text-neutral-700"
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, i) => (
                      <td key={cell.id} className="px-4 py-8">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprukoDashboard;
