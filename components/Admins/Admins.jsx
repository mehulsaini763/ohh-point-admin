"use client";
import React, { useContext, useState } from "react";
import { MyContext } from "@/context/MyContext";
import AdminHome from "./AdminHome";
import CreateAdmin from "./CreateAdmin";

const Admins = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [searchtext, setSearchText] = useState("");
  const {brands, setBrands, fetchBrands} = useContext(MyContext);
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <AdminHome />;
    //   case "vendorsDetails":
    //     return <VendorsDetails />;
    //   case "verificationAndApprovals":
    //     return <VerificationAndAprrovals />;
    //   case "Payments":
    //     return <Payment />;
      case "CreateAdmin":
        return <CreateAdmin />;
      default:
        return <AdminHome />;
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
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Admins</h1>
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
            <li
              className={`cursor-pointer ${
                activeSection === "CreateAdmin"
                  ? "text-oohpoint-tertiary-2"
                  : ""
              }`}
              onClick={() => {
                setActiveSection("CreateAdmin");
              }}
            >
              Add Admin
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

export default Admins;
