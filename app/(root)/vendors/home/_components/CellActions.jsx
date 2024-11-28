import React from "react";
import AssignCampaigns from "./AssignCampaigns";
import Details from "./VendorsDetails/VendorsDetails";

const CellActions = ({ vendors, vendor, setVendors, campaigns }) => {
  return (
    <div className="mx-auto flex flex-col gap-2 items-center justify-center">
      <AssignCampaigns
        vendors={vendors}
        setVendors={setVendors}
        campaigns={campaigns}
      />
      <Details data={vendor} />
    </div>
  );
};

export default CellActions;
