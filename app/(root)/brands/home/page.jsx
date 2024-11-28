"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyContext";
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
import AddBrand from "./_components/AddBrand";
import BrandDetails from "./_components/BrandDetails";

const Brands = () => {
  const { brands, fetchBrands, campaigns } = useContext(MyContext); 

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    { accessorKey: "brandId", header: <div className="text-left">id</div> },
    {
      accessorKey: "brandName",
      header: <div className="text-left">name</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.original?.imageUrl || ""}
            width={32}
            height={32}
            alt="img"
          />
          {row.getValue("brandName") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name of POC",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("name") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-right">
          {moment.unix(row.getValue("createdAt")?.seconds).format("DD/MM/YY")}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <div className="flex justify-center items-center"><BrandDetails brand={row.original} campaigns={campaigns}/></div>,
    },
  ];

  const table = useReactTable({
    data: brands,
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
    <div className="bg-oohpoint-grey-200 flex flex-col p-6 gap-6 w-full">
      <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Brands</h1>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <input
            type="text"
            placeholder="Search by Name"
            className="px-4 py-2 rounded-lg"
            value={table.getColumn("ownerName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("ownerName")?.setFilterValue(event.target.value)
            }
          />
          <AddBrand />
        </div>
      </div>
      {brands.length == 0 ? (
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
      {brands.length != 0 && (
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

export default Brands;

// import Brands from "@/components/Brands/Brands";
// import React from "react";

// const page = () => {
//   return <Brands />;
// };

// export default page;
