import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ModalDetails = ({ data, refresh }) => {
  const [resolveDialogOpen, setResolveDialogOpen] = useState(
    data.status == "Opened"
  );
  const [closeDialogOpen, setCloseDialogOpen] = useState(
    data.status == "Reopened"
  );
  const [resolvedMessage, setResolvedMessage] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(
    ["Closed", "Resolved"].includes(data.status)
  );
  const [closedMessage, setClosedMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleResolvedMessage = async () => {
    try {
      setResolveDialogOpen(false);
      const queryRef = doc(db, "vendorQueries", data.id); // Fix the path for Firestore
      await updateDoc(queryRef, {
        status: "Resolved",
        resolvedMessage,
      });

      toast.success("Query marked as resolved.");
      refresh();
    } catch (error) {
      console.log("Error updating query status:", error);
    }
  };

  const handleClosedMessage = async () => {
    try {
      setCloseDialogOpen(false);
      const queryRef = doc(db, "vendorQueries", data.id); // Fix the path for Firestore
      await updateDoc(queryRef, {
        status: "Closed",
        closedMessage,
      });

      toast.success("Query marked as closed.");
      refresh();
    } catch (error) {
      console.log("Error updating query status:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button className="w-fit" onClick={() => setOpen(true)}>
          <Eye size={28} color="white" fill="purple" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center z-10">
          {/* Resolve Modal */}
          {resolveDialogOpen && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Write Message</h2>
              <label className="block mb-2 text-sm">Subject</label>
              <input
                className="w-full border p-2 rounded-lg mb-4"
                disabled
                value={`${data.id}: Issue Resolved`}
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
                  onClick={() => setOpen(false)}
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
          )}

          {/* Close Modal */}
          {closeDialogOpen && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Close Query</h2>
              <label className="block mb-2 text-sm">Subject</label>
              <input
                className="w-full border p-2 rounded-lg mb-4"
                disabled
                value={`${data.id}: Issue Closed`}
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
                  onClick={() => setOpen(false)}
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
          )}

          {/* View Modal */}
          {/* {viewDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">View Query</h2>
            <p><strong>Customer:</strong> {data.customerName}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Category:</strong> {formatString(data.category)}</p>
            <p><strong>Message:</strong> {data.openMessage}</p>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mt-4"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
          {viewDialogOpen && data && (
            <div className="bg-white p-6 px-10 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                Query Details - {data.queryId}
              </h2>
              <div className="mb-4">
                <h3 className="font-semibold">Open Message:</h3>
                <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                  {data.openMessage}
                </p>
              </div>
              {data.resolvedMessage && (
                <div className="mb-4">
                  <h3 className="font-semibold">Resolved Message:</h3>
                  <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                    {data.resolvedMessage}
                  </p>
                </div>
              )}
              {data.reopenedMessage && (
                <div className="mb-4">
                  <h3 className="font-semibold">Reopened Message:</h3>
                  <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                    {data.reopenedMessage}
                  </p>
                </div>
              )}
              {data.closedMessage && (
                <div className="mb-4">
                  <h3 className="font-semibold">Closed Message:</h3>
                  <p className="bg-oohpoint-grey-200 rounded-3xl p-4">
                    {data.closedMessage}
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ModalDetails;
