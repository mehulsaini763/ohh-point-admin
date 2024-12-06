"use client";

import React, { useContext, useState } from "react";
import { MyContext } from "@/context/MyContext";
import moment from "moment";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import StatusModal from "./_components/StatusModal";

const page = () => {
  const { users, fetchUsers } = useContext(MyContext);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    {
      id: "id",
      accessorKey: "id",
      header: <div className="text-left">id</div>,
    },
    {
      accessorKey: "name",
      header: <div className="text-left">name</div>,
    },
    {
      accessorKey: "email",
      header: <div className="mx-auto">email</div>,
      cell: ({ row }) => (
        <div className="mx-auto text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "role",
      cell: ({ row }) => (
        <div className="mx-auto text-center">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: <div className="text-center">status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("status") == "unblocked" ? (
            <div className="px-3 py-1 text-sm uppercase text-green-700 bg-green-300 text-center w-fit rounded-md">
              Active
            </div>
          ) : (
            <div className="px-3 py-1 text-sm uppercase text-red-700 bg-red-300 text-center w-fit rounded-md">
              Blocked
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: <div className="text-right">date</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {moment
            .unix(row.getValue("createdAt")?.seconds || 0)
            .format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => (
        <div className="text-center">
          <StatusModal data={row.original} refresh={fetchUsers} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
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
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-4 md:gap-6">
        <div>
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Users</h1>
          <p className="text-oohpoint-tertiary-1">
            All you need to know about users!
          </p>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <input
            type="text"
            placeholder="Search by Name"
            className="px-4 py-2 rounded-lg"
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      {users.length == 0 ? (
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
      {users.length != 0 && (
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

export default page;
