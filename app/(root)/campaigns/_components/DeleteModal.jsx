import Modal from "@/components/Modal";
import { MyContext } from "@/context/MyContext";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Loader2, Trash } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const DeleteModal = ({ campaign }) => {
  const { fetchCampaigns } = useContext(MyContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "campaigns", campaign.cid);
      await deleteDoc(docRef);
      toast.success("Campaign Delete Successfully");
      fetchCampaigns();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
    setLoading(false);
  };
  return (
    <>
      <div>
        <button
          type="button"
          className={`cursor-pointer text-white bg-red-700 rounded-md p-2 my-auto`}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash size={18} />
        </button>
      </div>
      <Modal
        className={"flex flex-col gap-6 bg-white rounded-lg border p-6"}
        open={open}
        close={() => setOpen(false)}
      >
        <p className="font-medium text-2xl">Alert</p>
        <div className="flex items-center justify-center h-48 px-8">
          This action cannot be undone. Are you sure?
        </div>
        <button
          className="text-white px-4 py-2 font-medium bg-red-700 ml-auto rounded-md"
          onClick={handleDelete}
        >
          {loading ? <Loader2 className="animate-spin text-white" /> : "Delete"}
        </button>
      </Modal>
    </>
  );
};

export default DeleteModal;
