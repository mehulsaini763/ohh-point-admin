import React, { useState } from "react";
import VerificationTable from "../../VerificationTable";
import Details from "../../Details";
// import profile from "../../../public/assets/profile.png"
const Payment = () => {

  return (
    <div className="w-full ">
      {/* <div className="w-full bg-oohpoint-grey-100 flex justify-between px-5 rounded-2xl items-center py-5">
        <div>
          <h1 className="text-2xl text-oohpoint-primary-1">
            Number of pending Approvals
          </h1>
          <p className="text-base text-[#441886]">
            Total number of pending approvals of vendors
          </p>
        </div>
        <div className="text-3xl font-bold text-oohpoint-primary-2">{num}</div>
      </div> */}
      <div className="mt-10">
      
          <VerificationTable />
       
      
      </div>
    </div>
  );
};

export default Payment;
