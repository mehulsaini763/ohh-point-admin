"use client";
import React, { useContext, useState } from "react";
import { MyContext } from "@/context/MyContext";
import CreateBlog from "./CreateBlog";
import BlogsHome from "./BlogsHome";

const Blogs = () => {
  const [activeSection, setActiveSection] = useState("home");
  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <BlogsHome />;
      case "CreateBlog":
        return <CreateBlog />;
      default:
        return <BlogsHome />;
    }
  };

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start ">
      <div className=" w-full flex flex-col items-start justify-center px-8 pt-4 gap-1">
        <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">Blogs</h1>
        <p className=" text-oohpoint-tertiary-2">All you need to know about blogs!</p>
        <div className="flex justify-between  w-full max-xl:flex-col max-xl:gap-6 mt-4">
          <ul className="flex  gap-5 text-oohpoint-grey-300 max-md:flex-col cursor-pointer">
          <li
              className={`cursor-pointer text-oohpoint-primary-2 rounded-lg px-4 py-2 my-auto`}
              onClick={() => {
                setActiveSection("home");
              }}
            >
              Home
            </li>
            <li
              className={`cursor-pointer bg-oohpoint-primary-2 text-white rounded-lg px-4 py-2 text-sm my-auto`}
              onClick={() => {
                setActiveSection("CreateBlog");
              }}
            >
              Create New Blog
            </li>
          </ul>
        </div>
      </div>
      <div className=" w-full flex flex-col items-start justify-start px-8 gap-4">
        {renderSection()}
      </div>
    </div>
  );
};

export default Blogs;
