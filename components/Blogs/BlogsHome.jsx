"use client";
import React, { useContext } from "react";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "@/components/NewTable";
import CreateBlog from "./CreateBlog";

const BlogsHome = () => {
  const { blogs, setBlog, mode, setMode } = useContext(MyContext);

  // Function to generate table data for campaigns
  const transformBlogsData = (blogs) => {
    return blogs.map((blog) => ({
      blog: {
        name: `${blog.title.slice(0, 17)}...` || "N/A",
        img: blog.image,
      }, // Campaign Name
      id: blog.slug || "N/A", // Campaign ID
      // desc: `${blog.description.slice(0, 20)}...` || "N/A", // Campaign ID
      impressions: blog.category || "N/A", // Assuming impressions are based on ipAddress
      type: blog.isCaseStudy? "Case Study" : "Blog",
      startDate:
        new Date(blog.createdAt.seconds * 1000).toLocaleDateString() || "N/A", // Start Date
      button: "Edit",
    }));
  };

  return (
    <>
      {mode === "edit" ? (
        <CreateBlog />
      ) : (
        <div className="w-full h-full">
          <div className="w-full flex flex-col items-start justify-start lg:px-0 px-1 gap-4 mt-2 py-5">
            <DynamicTable
              headings={[
                "Title",
                "Slug",
                // "Description",
                "Category",
                "Type",
                "Created At",
                "",
              ]}
              data={transformBlogsData(blogs)}
              rowsPerPage={4}
              pagination={true}
              view={(id) => {
                setMode("edit");
                const data = blogs.find((c) => c.slug === id);
                setBlog(data);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlogsHome;
