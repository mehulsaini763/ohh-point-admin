"use client";
import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Count: ${value}`}</text> {/* Changed this line to show the actual value */}
    </g>
  );
};

const PieChartComponent = ({ campaigns, vendors, users }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const data = [
    { name: "Users", value: users },
    { name: "Vendors", value: vendors },
    { name: "Campaigns", value: campaigns },
  ];

  return (
    <div className="pie-chart-container min-w-[18rem] w-[30%] bg-white rounded-lg flex max-lg:flex-col justify-center items-center px-2 lg:h-full h-fit">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={200} height={200}>
          <Tooltip/>
          <Pie
            // activeIndex={activeIndex}
            // activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
      <div>
        <ul className="list-none text-sm">
          <li className="flex items-center mb-2">
            <div className="w-1 h-1 bg-oohpoint-primary-2 rounded-full mr-2"></div>
            Users
          </li>
          <li className="flex items-center mb-2">
            <div className="w-1 h-1 bg-oohpoint-primary-2 rounded-full mr-2"></div>
            Vendors
          </li>
          <li className="flex items-center mb-2">
            <div className="w-1 h-1 bg-oohpoint-primary-2 rounded-full mr-2"></div>
            Campaigns
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;
