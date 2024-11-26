"use client";
import React, { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";

const QrHome = () => {
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
    <>
      <div className="w-full h-full">
        <div className="w-full flex flex-col items-start justify-start lg:px-0 px-1 gap-4 mt-2 py-5">
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
          />
        </div>
      </div>
    </>
  );
};

export default QrHome;
