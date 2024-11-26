"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";

const AdminHome = () => {
  const { admins } = useContext(MyContext);

  const headings = ["Name", "Email", "ID", "Role", "Date"];

  const transformadminsData = (admins) => {
    return admins.map((admin) => ({
      admin: { name: admin.name || "N/A", img: admin.imageUrl || "" },
      email: `${admin.email}` || "N/A", // Name of the admin (owner's name)
      id: admin.adminId || "N/A",
      role: admin.role || "N/A", // Brand ID  // Phone number of the admin
      date:
        new Date(
          admin.createdAt.seconds * 1000 + admin.createdAt.nanoseconds / 1000000
        ).toLocaleDateString() || "N/A", // Date of creation, formatted
    }));
  };

  return (
    <div className="w-full h-full">
      <div className=" w-full flex flex-col items-start justify-start lg:px-0 px-1 gap-4 py-5">
        <DynamicTable
          headings={headings}
          data={transformadminsData(admins)}
          rowsPerPage={4}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default AdminHome;
