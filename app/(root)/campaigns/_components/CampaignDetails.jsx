"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import GradientBarChart from "@/components/BarChart";
import SimpleLineChart from "@/components/LineChart";
import SimplePieChart from "@/components/PieChart";
import {
  MdMoney,
  MdOutlineFormatTextdirectionRToL,
  MdQrCodeScanner,
  MdTextIncrease,
} from "react-icons/md";
import { IoMdQrScanner } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import dynamic from "next/dynamic";
import CampaignCompletionCircle from "@/components/RadialChart";
import PieChartComponent from "@/components/DonutChart";
import PieChartNew from "@/components/PieChartNew";
import Modal from "@/components/Modal";

const MapLocation = dynamic(() => import("@/components/MapLocation"), {
  ssr: false, // This will disable server-side rendering for the map
});

const CampaignDetail = ({ campaign }) => {
  // Data for the bar chart (distribution of scans per month - example)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [monthlyScans, setMonthlyScans] = useState([]);
  const [hourlyScansData, setHourlyScansData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const scans = campaign.ipAddress;
    if (scans) {
      const monthlyScans = scans?.reduce((acc, scan) => {
        const month = new Date(scan.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const scansData = Object.keys(monthlyScans).map((monthIndex) => ({
        name: monthNames[monthIndex], // Use the month name from `monthNames` array
        value: monthlyScans[monthIndex] || 0, // Use the number of scans or 0 if none
      }));
      setMonthlyScans(scansData);

      const hourlyScans = scans?.reduce((acc, scan) => {
        const hour = new Date(scan.createdAt).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      const hourlyScansData = Object.keys(hourlyScans).map((hour) => ({
        name: `${hour}:00`, // Use the hour in HH:00 format
        value: hourlyScans[hour] || 0, // Use the number of scans or 0 if none
      }));
      setHourlyScansData(hourlyScansData);
    }
    if (campaign.location) {
      setLocations(campaign.location);
    }
  }, [campaign]);

  return (
    <>
      <div>
        <button
          type="button"
          className={`cursor-pointer text-purple-700 bg-purple-300 rounded-md px-3 py-1 my-auto`}
          onClick={() => {
            setOpen(true);
          }}
        >
          Insights
        </button>
      </div>
      <Modal open={open} close={() => setOpen(false)}>
        <div className="w-full grid gap-8 grid-cols-4 bg-oohpoint-grey-200 rounded-lg overflow-y-auto p-8">
          {/* Campaign Overview Cards */}
            <GradientBarChart
              head="Distribution of Scans"
              count={`+${campaign.ipAddress?.length || 0}`}
              Icon={true}
              data={monthlyScans}
              darkColor="#B77DC4"
              lightColor="#F7D5FF"
            />
            <SimpleLineChart
              head="Hourly Distribution of Scans"
              count={`+${campaign.ipAddress?.length || 0}`}
              Icon={true}
              data={hourlyScansData}
            />
              <Card
                head="Total Scans"
                count={`+${campaign.ipAddress?.length || 0}`}
                Icon={MdQrCodeScanner}
                info="+22 from last month"
                bgColor="green"
              />
              <Card
                head="Unique Scans"
                count={`+${campaign.locationIp?.length || 0}`}
                Icon={IoMdQrScanner}
                info="-64 from last month"
                bgColor="red"
              />
            {locations.length > 0 && <MapLocation locations={locations} />}
            <CampaignCompletionCircle
              completedPercentage={
                (campaign.locationIp?.length / campaign.moq) * 100 || 0
              }
            />
              <Card
                head="Total Redirects"
                count={`+${campaign.redirects || 0}`}
                Icon={MdOutlineFormatTextdirectionRToL}
                info="+22"
              />
              <Card
                head="Total Investment"
                count={`Rs. ${campaign.campaignBudget}`}
                Icon={MdMoney}
              />

          {/* State-wise Distribution (Pie chart + Table) */}
          <div className="flex justify-center items-center gap-8 flex-col bg-white col-span-4 rounded-lg w-full px-16 py-8">
            <h2 className="text-xl w-full text-oohpoint-primary-2 text-left">
              State-wise distribution
            </h2>
            <div className="flex justify-between gap-4 items-start w-full">
              <div className="rounded-3xl w-1/3 h-full border border-oohpoint-grey-300 bg-oohpoint-grey-200 text-oohpoint-grey-300">
                {campaign.cities && (
                  <table className=" w-full border-collapse">
                    <thead>
                      <tr className=" border-b  border-primary p-4">
                        <th className=" p-4 text-start">States</th>
                        <th className=" p-4 text-start">Scans</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(campaign.cities).map(
                        ([key, value], i) => (
                          <tr className={` p-4`}>
                            <td className=" p-4 text-start">{key}</td>
                            <td className=" p-4 text-start">{value}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="w-1/2 h-full bg-white flex p-4 rounded-xl justify-center items-center">
                {campaign.cities && <PieChartNew data={campaign.cities} />}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CampaignDetail;
