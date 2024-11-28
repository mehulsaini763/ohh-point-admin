'use client'

import React, { useContext } from "react";
import Card from "@/components/Card";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCampaign } from "react-icons/md";
import { PiHandshake } from "react-icons/pi";
import UserTable from "./_components/UsersTable";
import { MyContext } from "@/context/MyContext";

const page = () => {
  const { users } = useContext(MyContext);
  console.log(users);

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-6 p-6">
      <div className="w-full flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Users</h1>
          <p className="text-oohpoint-tertiary-1">
            All you need to know about users!
          </p>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-lg"
          />
          <div>
            <img src="/assets/refresh.png" alt="" srcset="" />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          head="Pending Approvals"
          count="60"
          Icon={IoIosCheckmarkCircleOutline}
        />
        <Card head="Active Vendors" count="90" Icon={MdOutlineCampaign} />
        <Card head="Total number of vendors" count="60" Icon={PiHandshake} />
      </div>
      <UserTable />
    </div>
  );
};

export default page;
