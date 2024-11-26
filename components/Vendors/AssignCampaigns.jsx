"use client";
import React, { useContext, useState } from "react";
import DynamicTable from "../NewTable";
import toast from "react-hot-toast";
import { MyContext } from "@/context/MyContext";

const AssignCampaigns = ({ vendors, setVendors, campaigns }) => {
  const { fetchVendors } = useContext(MyContext);
  const [assignModal, setAssignModal] = useState(false);
  const [campaignId, setCampaignId] = useState("");
  const [pricePerScan, setPricePerScan] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [campaign, setCampaign] = useState({});
  const [vendor, setVendor] = useState({});
  const [firstPrize, setFirstPrize] = useState("");
  const [secondPrize, setSecondPrize] = useState("");
  const [thirdPrize, setThirdPrize] = useState("");
  const [fourthPrize, setFourthPrize] = useState("");
  const [fifthPrize, setFifthPrize] = useState("");
  const [sixthPrize, setSixthPrize] = useState("");
  const [firstPercent, setFirstPercent] = useState("");
  const [secondPercent, setSecondPercent] = useState("");
  const [thirdPercent, setThirdPercent] = useState("");
  const [fourthPercent, setFourthPercent] = useState("");
  const [fifthPercent, setFifthPercent] = useState("");
  const [sixthPercent, setSixthPercent] = useState("");

  const headings = [
    "Name",
    "ID",
    "Phone Number",
    "Date",
    "Number of Campaigns",
    "",
  ];
  const transformVendorsData = (vendors) => {
    return vendors.map((vendor) => ({
      vendor: {
        name: vendor.ownerName || "N/A",
        img:
          vendor.shopImage ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      }, // Name of the vendor (owner's name)
      id: vendor.vendorId || "N/A", // Vendor ID
      phoneNumber: vendor.phoneNumber || "N/A", // Phone number of the vendor
      date:
        new Date(
          vendor.createdAt.seconds * 1000 +
            vendor.createdAt.nanoseconds / 1000000
        ).toLocaleDateString() || "N/A", // Date of creation, formatted
      numberOfCampaigns: vendor.campaigns?.length || 0, // Number of campaigns
      button: "Assign", // Button to view more details
    }));
  };

  const assignCampaign = async () => {
    setLoading(true);
    if (
      !campaignId ||
      !vendorId ||
      !pricePerScan ||
      !firstPrize ||
      !secondPrize ||
      !thirdPrize ||
      !fourthPrize ||
      !fifthPrize ||
      !sixthPrize ||
      !firstPercent ||
      !secondPercent ||
      !thirdPercent ||
      !fourthPercent ||
      !fifthPercent ||
      !sixthPercent
    ) {
      setLoading(false);
      toast.error("Please fill all the fields");
      return;
    }

    // Ensure vendor?.campaigns and campaign?.vendors are arrays
    const campaigns = [
      ...(vendor?.campaigns || []),
      {
        pricePerScan,
        campaignId: campaignId,
        firstPrize,
        secondPrize,
        thirdPrize,
        fourthPrize,
        fifthPrize,
        sixthPrize,
        firstPercent,
        secondPercent,
        thirdPercent,
        fourthPercent,
        fifthPercent,
        sixthPercent,
      },
    ];
    const vendors = [
      ...(campaign?.vendors || []),
      {
        pricePerScan,
        vendorId,
        firstPrize,
        secondPrize,
        thirdPrize,
        fourthPrize,
        fifthPrize,
        sixthPrize,
        firstPercent,
        secondPercent,
        thirdPercent,
        fourthPercent,
        fifthPercent,
        sixthPercent,
      },
    ];

    try {
      const response = await fetch("/api/updateVendor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId, campaigns }),
      });

      const result = await response.json();
      if (response.ok) {
        // Handle success (e.g., show a success message)
        console.log("Vendor updated successfully");
      } else {
        // Handle errors (e.g., show an error message)
        console.error("Error assigning campaign:", result);
      }
    } catch (error) {
      console.error("Error assigning campaign:", error);
    }

    try {
      const response = await fetch("/api/updateCampaign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid: campaignId, vendors }),
      });

      const result = await response.json();
      if (response.ok) {
        // Handle success (e.g., show a success message)
        console.log("Campaign updated successfully");
        toast.success("Campaign assigned successfully");
        setAssignModal(false);
      } else {
        // Handle errors (e.g., show an error message)
        console.error("Error assigning vendor:", result);
      }
    } catch (error) {
      console.error("Error assigning vendor:", error);
    }

    setLoading(false);
    fetchVendors();
  };

  const assignClick = (vid) => {
    setAssignModal(true);
    const data = vendors.find((v) => v.vendorId === vid);
    setVendor(data);
    setVendorId(data.vid);
  };

  return (
    <div className="w-full ">
      <div className="w-full mt-5">
        <DynamicTable
          data={transformVendorsData(vendors)}
          pagination={true}
          rowsPerPage={4}
          functionn={assignClick}
          headings={headings}
        />
      </div>
      {assignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-3">
          <div className="bg-white max-h-[90vh] overflow-y-scroll p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl text-center font-semibold mb-8">
              Assign Campaign to Vendor
            </h2>
            <div className="mb-4">
              <label className="block text-gray-800">Campaign</label>
              <select
                value={campaignId}
                onChange={(e) => {
                  setCampaignId(e.target.value);
                  const data = campaigns.find(
                    (cp) => cp.cid === e.target.value
                  );
                  setCampaign(data);
                  console.log(data);
                }}
                className="mt-1 block w-full bg-gray-50 rounded-md p-2"
              >
                <option value="" disabled>
                  Select A Campaign
                </option>
                {campaigns.map((cp) =>
                  !vendor?.campaigns?.find((v) => v.campaignId === cp.cid) ? (
                    <option key={cp.cid} value={cp.cid}>
                      {cp.campaignName} - {cp.campaignId}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">Price Per Scan:</label>
              <input
                type="number"
                value={pricePerScan}
                onChange={(e) => setPricePerScan(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter price per scan"
              />
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">1st Prize:</label>
              <div>
                <input
                  type="text"
                  value={firstPrize}
                  onChange={(e) => setFirstPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 1st Prize"
                />
                <input
                  type="number"
                  value={firstPercent}
                  onChange={(e) => setFirstPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 1st Prize winning Percentage"
                />
              </div>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">2nd Prize:</label>
              <div>
                <input
                  type="text"
                  value={secondPrize}
                  onChange={(e) => setSecondPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 2nd Prize"
                />
                <input
                  type="number"
                  value={secondPercent}
                  onChange={(e) => setSecondPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 2nd Prize winning Percentage"
                />
              </div>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">3rd Prize:</label>
              <div>
                <input
                  type="text"
                  value={thirdPrize}
                  onChange={(e) => setThirdPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 3rd Prize"
                />
                <input
                  type="number"
                  value={thirdPercent}
                  onChange={(e) => setThirdPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 3rd Prize winning Percentage"
                />
              </div>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">4th Prize:</label>
              <div>
                <input
                  type="text"
                  value={fourthPrize}
                  onChange={(e) => setFourthPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 4th Prize"
                />
                <input
                  type="number"
                  value={fourthPercent}
                  onChange={(e) => setFourthPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 4th Prize winning Percentage"
                />
              </div>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">5th Prize:</label>
              <div>
                <input
                  type="text"
                  value={fifthPrize}
                  onChange={(e) => setFifthPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 5th Prize"
                />
                <input
                  type="number"
                  value={fifthPercent}
                  onChange={(e) => setFifthPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 5th Prize winning Percentage"
                />
              </div>
            </div>
            <div className=" mb-4">
              <label className="block text-gray-800">6th Prize:</label>
              <div>
                <input
                  type="text"
                  value={sixthPrize}
                  onChange={(e) => setSixthPrize(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 6th Prize"
                />
                <input
                  type="number"
                  value={sixthPercent}
                  onChange={(e) => setSixthPercent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter 6th Prize winning Percentage"
                />
              </div>
            </div>
            <div className="flex justify-end flex-col gap-3">
              <button
                onClick={assignCampaign}
                className="bg-oohpoint-primary-2 text-white py-2 w-full rounded-lg"
              >
                Assign
              </button>
              <button
                onClick={() => setAssignModal(false)}
                className="border-gray-200 border text-gray-800 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       
    </div>
  );
};

export default AssignCampaigns;
