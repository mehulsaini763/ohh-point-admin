import React from "react";

const VendorsCard4 = ({ profile }) => {
  return (
    <div className="bg-oohpoint-grey-100 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <span className="font-semibold">Business Name</span>
        <span>{profile.businessName}</span>
        <span className="font-semibold">Account Number</span>
        <span>{profile.accountNumber}</span>
        <span className="font-semibold">IFSC Code</span>
        <span>{profile.ifsc}</span>
        <span className="font-semibold">Operating Hours</span>
        <span className="break-words">
          {profile.openingHours} - {profile.closingHours}
        </span>{" "}
        {/* Apply break-words */}
        <span className="font-semibold">Operating Days</span>
        <span>{profile.operatingDays}</span>
        {/* <span className="text-blue-500 cursor-pointer">link</span> */}
      </div>
    </div>
  );
};

export default VendorsCard4;
