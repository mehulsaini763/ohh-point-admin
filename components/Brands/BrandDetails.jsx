import React from "react";
import BrandCard from "./BrandCard";
import BrandCard2 from "./BrandCard2";
import BrandCard3 from "./BrandCard3";


const BrandDetails = ({brand, campaigns}) => {

  return (
    <div className="w-full pb-8">
      {/* Profile Section */}
      <div className="w-full bg-oohpoint-grey-100 flex justify-between px-10 py-5 rounded-xl">
        <div>
          <h2 className="text-oohpoint-primary-1 text-3xl">Meet {brand.brandName}!</h2>
          <p>ID - {brand.brandId}</p>
        </div>
        <div>
          <img src={brand.imageUrl} alt="brand" className=" rounded-full h-16 w-16" />
        </div>
      </div>

      <div className="mt-5 w-full grid gap-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          <BrandCard brand={brand} />
          <BrandCard2 brand={brand} campaigns={campaigns} />
      </div>
      <div  className="mt-5 w-full flex gap-4 max-lg:flex-col">
          {campaigns && <BrandCard3 campaigns={campaigns}/> }
        </div>
    </div>
  );
};

export default BrandDetails;
