import React from "react";

const VendorsCard = ({ profile }) => {
  return (
    <div className="bg-oohpoint-grey-100 rounded-2xl px-7 mt-3 py-5 flex justify-between items-start w-[30%] min-w-[16rem]">
      <div className="text-lg font-normal space-y-2">
        <h1>No. of Campaigns</h1>
        <p className="font-bold text-2xl text-oohpoint-primary-2">{profile?.campaigns?.length || 0}</p>
        {/* <h1 >Revenue Generated</h1>
        <p className="font-bold text-2xl text-oohpoint-primary-2">{profile?.revenue || 0}</p> */}
      </div>
    </div>
  );
};

export default VendorsCard; 
