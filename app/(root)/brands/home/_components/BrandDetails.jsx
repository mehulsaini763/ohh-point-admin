import React, { useState } from "react";
import BrandCard from "./BrandCard";
import BrandCard2 from "./BrandCard2";
import BrandCard3 from "./BrandCard3";
import Modal from "@/components/Modal";

const BrandDetails = ({ brand, campaigns }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="mx-auto bg-purple-300 text-purple-700 py-1 px-3 rounded-lg hover:scale-95 transition-all"
        onClick={() => setOpen(true)}
      >
        Know More
      </button>
      <Modal open={open} close={() => setOpen(false)}>
        <div className="p-8 bg-oohpoint-grey-200 rounded-lg h-full overflow-y-auto grid md:grid-cols-4 gap-6">
          {/* Profile Section */}
          <div className="w-full bg-white flex justify-between px-10 py-5 rounded-xl col-span-full">
            <div>
              <h2 className="text-oohpoint-primary-1 text-3xl">
                Meet {brand.brandName}!
              </h2>
              <p>ID - {brand.brandId}</p>
            </div>
            <div>
              <img
                src={brand.imageUrl}
                alt="brand"
                className=" rounded-full h-16 w-16"
              />
            </div>
          </div>
          <BrandCard brand={brand} />
          <BrandCard2 brand={brand} campaigns={campaigns} />
          <div className="col-span-full bg-white rounded-lg">
            {campaigns && <BrandCard3 campaigns={campaigns} />}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BrandDetails;
