import React from "react";

const BrandCard2 = ({ campaigns }) => {
  return (
    <div className="bg-oohpoint-grey-100 rounded-2xl px-7 mt-3 py-5 flex flex-col gap-4 justify-start items-start  min-w-[20rem] md:col-span-2">
        <h3 className=" text-lg">Number of Campaigns</h3>
      <p className=" font-bold text-4xl text-oohpoint-primary-2">{campaigns.length}</p>
    </div>
  );
};

export default BrandCard2;
