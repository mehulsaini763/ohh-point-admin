import React from "react";
import SimpleLineChart from "./LineChart";
import SimplePieChart from "./PieChart";
import SpiderChart from "./SpiderChart";
import GradientBarChart from "./BarChart";
import Card from "./Card";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import Table from "./Table";
import LogOutButton from "./LogOutButton";

const Dashboard = () => {
  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start">
      <div className=" w-full flex flex-col items-start justify-center px-8 py-4 gap-1">
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
          Dashboard
          <LogOutButton />
        </h1>
        <p className=" text-oohpoint-tertiary-2 font-medium">
          Welcome back, Pankaj
        </p>
      </div>
      <div className=" w-full flex flex-col items-start justify-start px-8 gap-4">
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          <Card
            head="Pending Approvals"
            count="60"
            Icon={IoIosCheckmarkCircleOutline}
          />
          <Card
            head="Number of campaigns"
            count="90"
            Icon={MdOutlineCampaign}
          />
          <Card head="Total vendors" count="750" Icon={PiHandshake} />
        </div>
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-center gap-4 lg:gap-2">
          <GradientBarChart
            head="Number of campaigns"
            count="90"
            Icon={true}
            darkColor="#B77DC4"
            lightColor="#F7D5FF"
          />
          <GradientBarChart
            head="Total Users"
            count="7000"
            Icon={false}
            darkColor="#441886"
            lightColor="#E6D6FF"
          />
          <SimpleLineChart
            head="Total Number of scans"
            count="65748"
            Icon={true}
          />
        </div>
        <div className=" w-full flex flex-wrap lg:justify-between justify-around items-start gap-4 lg:gap-2 pb-8">
          <SpiderChart head="Vendors" />
        </div>
      </div>
      <div className=" w-full flex flex-col items-start justify-start px-8 gap-4">
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
