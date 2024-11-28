import React from "react";

const BrandCard = ({ brand }) => {
  return (
    <div className="bg-oohpoint-grey-100 rounded-2xl px-7 mt-3 py-5 flex justify-between items-start min-w-[20rem] md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-[0.67rem]">
        <span className="font-semibold">Brand Name</span>
        <span>{brand.brandName}</span>
        <span className="font-semibold">Business Name</span>
        <span>{brand.businessName}</span>
        <span className="font-semibold">Brand ID</span>
        <span>{brand.brandId}</span>
        <span className="font-semibold">Email ID</span>
        <span className="break-words">{brand.email}</span> {/* Apply break-words */}
        <span className="font-semibold">Date</span>
        <span>{new Date(brand.createdAt.seconds * 1000 + brand.createdAt.nanoseconds / 1000000).toLocaleDateString()}</span>
        <span className="font-semibold">Subscription</span>
        <span>{brand.subscription}</span>
      </div>
    </div>
  );
};

export default BrandCard;
