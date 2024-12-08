"use client";
import { useContext, useRef, useState } from "react";
import CreateCampaign from "./_components/CreateCampaign";
import { MyContext } from "@/context/MyContext";
import Image from "next/image";
import moment from "moment";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, SortAsc, SortDesc } from "lucide-react";
import EditCampaign from "./_components/EditCampaign";
import CampaignDetails from "./_components/CampaignDetails";
import DeleteModal from "./_components/DeleteModal";
import { Popover } from "@mui/material";
import PauseModal from "./_components/PauseModal";
import QRCodeGenerator from "@/components/QRCode";

const Campaigns = () => {
  const { campaigns, user } = useContext(MyContext);

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
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]); // can set initial sorting state here

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
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => (
        <div className="text-center">
          {moment.unix(row.getValue("createdAt")?.seconds).format("DD/MM/YY")}
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
          {row.original?.isPaused ? (
            <div className="text-sm uppercase py-1 px-2 bg-neutral-300 text-neutral-700 rounded-md w-fit font-semibold">
              Paused
            </div>
          ) : (
            getStatus(row.getValue("startDate"), row.getValue("endDate"))
          )}
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
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);
        return (
          <div className="flex flex-col gap-2 justify-center items-center">
            <CampaignDetails campaign={row.original} />
            <div id={row.original.cid} className="relative">
              <button
                className="cursor-pointer bg-purple-700 text-white rounded-md px-3 py-1 my-auto"
                onClick={(e) => setOpen(e.currentTarget)}
              >
                Actions
              </button>
              <Popover
                id={row.original.cid}
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={open}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div className="space-y-1 p-2">
                  <EditCampaign campaign={row.original} />
                  <PauseModal campaign={row.original} />
                  <DeleteModal campaign={row.original} />
                </div>
              </Popover>
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination,
      sorting,
    },
  });

  const toggleCreatedAtSorting = () =>
    table.setSorting((state) => {
      const currentSorting = state.find((sort) => sort.id === "createdAt");
      if (currentSorting) {
        return currentSorting.desc
          ? [{ id: "createdAt", desc: false }]
          : [{ id: "createdAt", desc: true }]; // Sort ascending
      } else return []; // Clear sorting
    });

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-4 md:gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
            Campaigns
          </h1>
          <p className=" text-oohpoint-tertiary-2">
            All you need to know about campaigns!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6">
        <button
          type="button"
          className="bg-white rounded-md px-4 py-2 border hover:bg-neutral-100"
          onClick={toggleCreatedAtSorting}
        >
          {table.getState().sorting.find(({ id }) => id == "createdAt")
            ?.desc ? (
            <div className="flex gap-2 items-center">
              Sort Ascending <SortAsc size={18} />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              Sort Descending <SortDesc size={18} />
            </div>
          )}
        </button>
        <CreateCampaign />
      </div>
      {campaigns.length == 0 ? (
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
      {campaigns.length != 0 && (
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

export default Campaigns;
