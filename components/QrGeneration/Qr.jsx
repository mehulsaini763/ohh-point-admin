"use client";

import CreateQr from "./CreateQr";
import { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";

const Qr = () => {
  const { qrs } = useContext(MyContext);

  const transformBlogsData = (qrs) => {
    return qrs.map((qr) => ({
      title: qr.title,
      id: qr.qid,
      totalScans: qr.totalScans.length,
      uniqueScans: qr.uniqueScans.length,
      createdAt:
        new Date(qr.createdAt.seconds * 1000).toLocaleDateString() || "N/A", // Start Date
      qr: `https://user-ooh-point.vercel.app/qr/${qr.qid}`,
    }));
  };
  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-4 md:gap-6 p-4 md:p-6">
      <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-4 md:gap-6">
        <div>
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
            QR Code Generation
          </h1>
          <p className="text-oohpoint-tertiary-1">
            All you need to know about QR Codes!
          </p>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <CreateQr />
        </div>
      </div>
      <DynamicTable
        headings={[
          "Title",
          "ID",
          "Total Scans",
          "Unique Scans",
          "Created At",
          "QR Code",
        ]}
        data={transformBlogsData(qrs)}
        rowsPerPage={2}
        pagination={true}
      />{" "}
    </div>
  );
};

export default Qr;
