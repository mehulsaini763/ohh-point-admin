"use client";

import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
// import Details from "./_components/Details";
import Image from "next/image";
import moment from "moment";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import CreateVendor from "./_components/CreateVendor";
import CellActions from "./_components/CellActions";

const Page = () => {
  const { vendors, setVendors, campaigns } = useContext(MyContext);
  const [vendorsData, setVendorsData] = useState([]);
  const [campaignsAssigned, setCampaignsAssigned] = useState(0);

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
    const weekdayCounts = vendors.reduce((acc, item) => {
      const date = convertTimestampToDate(item?.createdAt);
      const weekday = getWeekdayName(date);

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
    setVendorsData(transformedData);

    let ca = 0;
    vendors.forEach((vendor) => {
      if (vendor.campaigns) {
        ca += vendor.campaigns.length;
      }
    });
    setCampaignsAssigned(ca);
  }, [vendors]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    { accessorKey: "vendorId", header: <div className="text-left">id</div> },
    {
      accessorKey: "ownerName",
      header: <div className="text-left">name</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={
              row.original?.shopImage ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            width={32}
            height={32}
            alt="img"
          />
          {row.getValue("ownerName") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("phoneNumber") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("createdAt")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "campaigns",
      header: "Number of Campaigns",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("campaigns")?.length || 0}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <CellActions
          vendors={vendors}
          vendor={row.original}
          setVendors={setVendors}
          campaigns={campaigns}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: vendors,
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
    <div className="bg-oohpoint-grey-200 flex flex-col p-4 gap-4 md:p-6 md:gap-6 w-full">
      <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-oohpoint-grey-500 font-bold text-4xl">
            Vendors
          </h1>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <input
            type="text"
            placeholder="Search by Name"
            className="px-4 py-2 rounded-lg w-48"
            value={table.getColumn("ownerName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("ownerName")?.setFilterValue(event.target.value)
            }
          />
          <CreateVendor />
        </div>
      </div>
      {vendors.length == 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md h-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="bg-white rounded-lg shadow-sm w-full ">
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
      )}
      {vendors.length != 0 && (
        <div className="flex justify-end items-center gap-2">
          <button
            className="rounded-md py-2 px-4 bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <div className="flex items-center justify-center p-2 px-4 rounded-md text-white aspect-square bg-oohpoint-primary-2">
            <strong>{table.getState().pagination.pageIndex + 1}</strong>
          </div>
          <button
            className="rounded-md py-2 px-4 bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;

// const page = () => {
//   return (
//     <div className="h-full w-full">
//       <Vendors />
//     </div>
//   );
// };

// export default page;
