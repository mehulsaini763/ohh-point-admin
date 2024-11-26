"use client";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { MyContext } from "@/context/MyContext";
import DynamicTable from "../NewTable";

const HelpDesk = ({ panelType }) => {
  const { searchQuery, setSearchQuery } = useContext(MyContext);
  const [headTitle, setHeadTitle] = useState("");
  const [panel, setPanel] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [queries, setQueries] = useState([]);
  const [clicked, setClicked] = useState("");
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [resolvedMessage, setResolvedMessage] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState({});
  const [closedMessage, setClosedMessage] = useState("");
  const [searchText, setSearchText] = useState("")

  // Set the title based on the panelType prop
  useEffect(() => {
    switch (panelType) {
      case "user":
        setHeadTitle("User Helpdesk");
        setPanel("userQueries");
        break;
      case "vendor":
        setHeadTitle("Vendor Helpdesk");
        setPanel("vendorQueries");
        break;
      case "brand":
        setHeadTitle("Brand Helpdesk");
        setPanel("brandQueries");
        break;
      default:
        setHeadTitle("Helpdesk");
    }
  }, [panelType]);

  const fetchQueries = async () => {
    try {
      const q = query(collection(db, panel), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const queriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueries(queriesData);
      setFilteredQueries(queriesData.filter((query) => query.status === "Opened"));
      setClicked("opened");
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleResolvedMessage = async () => {
    try {
      setResolveDialogOpen(false);
      const queryRef = doc(db, panel, selectedQuery.id); // Fix the path for Firestore
      await updateDoc(queryRef, {
        status: "Resolved",
        resolvedMessage,
      });

      toast.success("Query marked as resolved.");
      fetchQueries();
    } catch (error) {
      console.log("Error updating query status:", error);
    }
  };

  const handleClosedMessage = async () => {
    try {
      setCloseDialogOpen(false);
      const queryRef = doc(db, panel, selectedQuery.id); // Fix the path for Firestore
      await updateDoc(queryRef, {
        status: "Closed",
        closedMessage,
      });

      toast.success("Query marked as closed.");
      fetchQueries();
    } catch (error) {
      console.log("Error updating query status:", error);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [panelType, panel]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleOpenedQueries = () => {
    const filteredQueries = queries.filter((query) => query.status === "Opened");
    setFilteredQueries(filteredQueries);
    setClicked("opened");
  };

  const handleResolvedQueries = () => {
    const filteredQueries = queries.filter((query) => query.status === "Resolved");
    setFilteredQueries(filteredQueries);
    setClicked("resolved");
  };

  const handleReOpenedQueries = () => {
    const filteredQueries = queries.filter((query) => query.status === "Reopened");
    setFilteredQueries(filteredQueries);
    setClicked("reopened");
  };

  const handleClosedQueries = () => {
    const filteredQueries = queries.filter((query) => query.status === "Closed");
    setFilteredQueries(filteredQueries);
    setClicked("closed");
  };

  const formatString = (input) => {
    let formattedString = input.replace(/_/g, " ");
    formattedString = formattedString.replace(/\b\w/g, (char) => char.toUpperCase());
    return formattedString;
  };

  const handleResolveCloseModal = (id) => {
    setResolveDialogOpen(clicked === "opened");
    setCloseDialogOpen(clicked === "resolved" || clicked === "reopened");
    const query = queries.find((query) => query.queryId === id);
    setSelectedQuery(query);
  }
  const handleView = (id) => {
    setViewDialogOpen(true);
    const query = queries.find((query) => query.queryId === id);
    setSelectedQuery(query);
  }

  const tableHeadings = [panelType, "Query Id", "Category", "Created At", "", ""];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  
    // Perform search within the filtered queries based on the selected status (filter)
    const filtered = queries
      .filter((query) => query.status.toLowerCase() === clicked) // Ensure queries are filtered by the selected status
      .filter((query) => 
        query.queryId.toLowerCase().includes(e.target.value.toLowerCase()) ||
        query.customerName.toLowerCase().includes(e.target.value.toLowerCase())
      );
  
    setFilteredQueries(filtered);
  
    // If the search text is cleared, apply the filter again to reset the filtered queries
    if (e.target.value === "") {
      filterQueries(queries, clicked);
    }
  };

  const filterQueries = (queriesData, status) => {
    const filtered = queriesData.filter((query) => query.status.toLowerCase() === status);
    setFilteredQueries(filtered);
  };
  

  return (
    <div className="p-6 w-full px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{headTitle}</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-4 text-oohpoint-grey-300">

<button
  onClick={handleOpenedQueries}
  className={`px-4 py-2 rounded-lg transition-all  ${clicked === "opened" ? " text-oohpoint-tertiary-2" : ""}`}
>
  Opened
</button>
<button
  onClick={handleResolvedQueries}
   className={`px-4 py-2 rounded-lg transition-all  ${clicked === "resolved" ? " text-oohpoint-tertiary-2" : ""}`}
>
  Resolved
</button>
<button
  onClick={handleReOpenedQueries}
   className={`px-4 py-2 rounded-lg transition-all  ${clicked === "reopened" ? " text-oohpoint-tertiary-2" : ""}`}
>
  Re-Opened
</button>
<button
  onClick={handleClosedQueries}
   className={`px-4 py-2 rounded-lg transition-all  ${clicked === "closed" ? " text-oohpoint-tertiary-2" : ""}`}
>
  Closed
</button>
</div>
<input
type="text"
placeholder="Search"
className="px-4 py-1 rounded-lg"
value={searchText}
onChange={(e) => handleSearch(e)}
 />
      </div>

      <DynamicTable
        headings={tableHeadings}
        data={filteredQueries.map((query) => ({
          Name: query.customerName,
          id: query.id,
          "Phone Number": query.category,
          date: new Date(query?.createdAt?.toDate())?.toLocaleDateString(),
          "action": query.status === "Resolved" || query.status === "Reopened" ? "Close" : query.status === "Opened" ? "Resolve" : query.status,
          view: "View",
        }))}
        rowsPerPage={4}
        pagination={true}
        functionn={handleResolveCloseModal}
        view={handleView}
      />

      {/* Resolve Modal */}
      {resolveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Write Message</h2>
            <label className="block mb-2 text-sm">Subject</label>
            <input
              className="w-full border p-2 rounded-lg mb-4"
              disabled
              value={`${selectedQuery.id}: Issue Resolved`}
            />
            <label className="block mb-2 text-sm">Message</label>
            <textarea
              className="w-full border p-2 rounded-lg mb-4"
              rows="4"
              value={resolvedMessage}
              onChange={(e) => setResolvedMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
                onClick={() => setResolveDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                    className="bg-oohpoint-primary-2 text-white py-2 px-6 rounded-xl hover:bg-oohpoint-primary-3"
                onClick={handleResolvedMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Modal */}
      {closeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Close Query</h2>
            <label className="block mb-2 text-sm">Subject</label>
            <input
              className="w-full border p-2 rounded-lg mb-4"
              disabled
              value={`${selectedQuery.id}: Issue Closed`}
            />
            <label className="block mb-2 text-sm">Message</label>
            <textarea
              className="w-full border p-2 rounded-lg mb-4"
              rows="4"
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
                onClick={() => setCloseDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                    className="bg-oohpoint-primary-2 text-white py-2 px-6 rounded-xl hover:bg-oohpoint-primary-3"
                onClick={handleClosedMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {/* {viewDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">View Query</h2>
            <p><strong>Customer:</strong> {selectedQuery.customerName}</p>
            <p><strong>Email:</strong> {selectedQuery.email}</p>
            <p><strong>Category:</strong> {formatString(selectedQuery.category)}</p>
            <p><strong>Message:</strong> {selectedQuery.openMessage}</p>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mt-4"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
       {viewDialogOpen && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-all ">
          <div className="bg-white p-6 px-10 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Query Details{" "}-{" "}{selectedQuery.queryId}</h2>
            <div className="mb-4">
              <h3 className="font-semibold">Open Message:</h3>
              <p className="bg-oohpoint-grey-200 rounded-3xl p-4">{selectedQuery.openMessage}</p>
            </div>
            {selectedQuery.resolvedMessage && (
              <div className="mb-4">
                <h3 className="font-semibold">Resolved Message:</h3>
                <p className="bg-oohpoint-grey-200 rounded-3xl p-4">{selectedQuery.resolvedMessage}</p>
              </div>
            )}
            {selectedQuery.reopenedMessage && (
              <div className="mb-4">
                <h3 className="font-semibold">Reopened Message:</h3>
                <p className="bg-oohpoint-grey-200 rounded-3xl p-4">{selectedQuery.reopenedMessage}</p>
              </div>
            )}
            {selectedQuery.closedMessage && (
              <div className="mb-4">
                <h3 className="font-semibold">Closed Message:</h3>
                <p className="bg-oohpoint-grey-200 rounded-3xl p-4">{selectedQuery.closedMessage}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
                onClick={() => setViewDialogOpen(false)}
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

export default HelpDesk;
