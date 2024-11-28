import React from "react";

const VendorsCard = ({ profile }) => {
  return (
    <div className="bg-oohpoint-grey-100 rounded-lg p-4 h-fit md:col-span-2">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <span className="font-semibold">Phone number</span>
        <span>{profile.phoneNumber}</span>
        <span className="font-semibold">Email ID</span>
        <span className="break-words">{profile.email}</span>{" "}
        {/* Apply break-words */}
        <span className="font-semibold">Location</span>
        <span>{profile.address}</span>
        <span className="font-semibold">GST Number</span>
        <span>{profile.gstNumber}</span>
        {/* <span className="text-blue-500 cursor-pointer">link</span> */}
        <span className="font-semibold">KYC ID</span>
        <span>{profile.kycId}</span>
      </div>
    </div>
  );
};

export default VendorsCard;
