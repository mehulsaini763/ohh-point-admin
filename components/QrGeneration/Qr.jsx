"use client";

import QrHome from "./QrHome";
import CreateQr from "./CreateQr";

const Qr = () => {
  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col gap-6 p-6">
      <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className=" text-oohpoint-grey-500 font-bold text-4xl">
            QR Code Generation
          </h1>
          <p className="text-oohpoint-tertiary-1">
            All you need to know about QR Codes!
          </p>
        </div>
        <div className="flex items-center gap-4 md:justify-end justify-between">
          <CreateQr />
        </div>
      </div>
      <QrHome />
    </div>
  );
};

export default Qr;
