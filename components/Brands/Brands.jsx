"use client";
import React, { useContext, useState } from "react";
import Home from "@/app/(root)/page";
import AddBrand from "./AddBrand";
import BrandsHome from "./BrandsHome";
import { MyContext } from "@/context/MyContext";

const Brands = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [searchtext, setSearchText] = useState("");
  const {brands, setBrands, fetchBrands} = useContext(MyContext);
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <BrandsHome />;
    //   case "vendorsDetails":
    //     return <VendorsDetails />;
    //   case "verificationAndApprovals":
    //     return <VerificationAndAprrovals />;
    //   case "Payments":
    //     return <Payment />;
      case "AddBrand":
        return <AddBrand />;
      default:
        return <BrandsHome />;
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filteredBrands = brands.filter((brand) =>
      brand.brandId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setBrands(filteredBrands);
    if (e.target.value === "") {
      fetchBrands();
    }
  }

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start ">
      <div className=" w-full flex flex-col items-start justify-center px-8 py-4 gap-1">
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Brands</h1>
        <div className="flex justify-between  w-full max-xl:flex-col max-xl:gap-6">
          <ul className="flex  gap-5 text-oohpoint-grey-300 max-md:flex-col cursor-pointer">
            <li
              className={`cursor-pointer ${
                activeSection === "home" ? "text-oohpoint-tertiary-2" : ""
              }`}
              onClick={() => {
                setActiveSection("home");
              }}
            >
              Home
            </li>
            {/* <li
              className={`cursor-pointer ${
                activeSection === "vendorsDetails"
                  ? "text-oohpoint-tertiary-2"
                  : ""
              }`}
              onClick={() => {
                setActiveSection("vendorsDetails");
              }}
            >
              Vendor Details
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "verificationAndApprovals"
                  ? "text-oohpoint-tertiary-2"
                  : ""
              }`}
              onClick={() => {
                setActiveSection("verificationAndApprovals");
              }}
            >
              Verifications and Approvals
            </li>
            <li
              className={`cursor-pointer ${
                activeSection === "Payments" ? "text-oohpoint-tertiary-2" : ""
              }`}
              onClick={() => {
                setActiveSection("Payments");
              }}
            >
              Payments
            </li> */}
            <li
              className={`cursor-pointer ${
                activeSection === "AddBrand"
                  ? "text-oohpoint-tertiary-2"
                  : ""
              }`}
              onClick={() => {
                setActiveSection("AddBrand");
              }}
            >
              Add Brand
            </li>
          </ul>
          <div className="flex gap-5 max-md:flex-wrap max-md:gap-4 max-md:mt-3">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-1 rounded-lg"
              value={searchtext}
              onChange={(e) => handleSearch(e)}
            />
            <div>
              <img src="/assets/refresh.png" alt="" srcset="" />
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex flex-col items-start justify-start px-8 gap-4">
        {renderSection()}
      </div>
    </div>
  );
};

export default Brands;
