import Modal from "@/components/Modal";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const StatusModal = ({ data, refresh }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onStatusChange = async () => {
    setLoading(true);
    try {
      const queryRef = doc(db, "users", data.id); // Fix the path for Firestore
      await updateDoc(queryRef, {
        status: data.status == "unblocked" ? "blocked" : "unblocked",
      });

      toast.success("Updated User Status");
      refresh();
      setOpen(false);
    } catch (error) {
      console.log("Error updating User status:", error);
    }
    setLoading(true);
  };

  return (
    <>
      {data.status == "unblocked" ? (
        <button
          className="px-4 py-2 text-white bg-red-600 mx-auto text-center w-fit rounded-md"
          onClick={() => setOpen(true)}
        >
          Block
        </button>
      ) : (
        <button
          className="px-4 py-2 text-white bg-purple-600 mx-auto text-center w-fit rounded-md"
          onClick={() => setOpen(true)}
        >
          Unblock
        </button>
      )}
      <Modal open={open} close={() => setOpen(false)}>
        <div className="bg-white p-8 flex flex-col h-72 aspect-[2/1] rounded-md justify-between items-start">
          <p className="text-xl font-semibold">Alert</p>
          <div className="w-full text-center">
            Are you sure want to{" "}
            {data.status == "unblocked" ? "block" : "unblock"} this user?
          </div>
          <div className="flex justify-end gap-4 w-full">
            <button
              onClick={() => setOpen(false)}
              className="bg-neutral-200 rounded-md w-fit py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={onStatusChange}
              className="bg-purple-700 text-white rounded-md w-fit py-2 px-4 flex items-center gap-2"
            >
              {loading && <Loader2 color="white" className="animate-spin" />}{" "}
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StatusModal;
