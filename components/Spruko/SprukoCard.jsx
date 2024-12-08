// components/StatCard.js
import React from "react";
import SprukoLineChart from "./SprukoLineChart";

const SprukoCard = ({
  title,
  value,
  increase,
  color,
  iconColor,
  Icon,
  bgColor,
  lineData,
  lineColor,
}) => {
  return (
    <div className="p-6 flex items-start justify-between h-full w-full bg-white shadow rounded-md">
      <div className="flex items-start gap-4 flex-col">
        <div className={`p-2 rounded-full text-2xl ${iconColor} ${bgColor}`}>
          <Icon />
        </div>
        <p className="text-2xl">{value}</p>
        <p className={`text-sm ${color}`}>
          {increase} <span className=" text-gray-400">Increased</span>
        </p>
      </div>
      <div className="text-right flex flex-col items-center justify-between h-full">
        <p className=" text-gray-400 text-sm">{title}</p>
        <SprukoLineChart data={lineData} color={lineColor} />
      </div>
    </div>
  );
};

export default SprukoCard;
