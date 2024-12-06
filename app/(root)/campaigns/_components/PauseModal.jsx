import Modal from "@/components/Modal";
import { MyContext } from "@/context/MyContext";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, Pause, Play, Trash } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const PauseModal = ({ campaign }) => {
  const { fetchCampaigns } = useContext(MyContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "campaigns", campaign.cid);
      await updateDoc(docRef, { isPaused: !campaign.isPaused });
      toast.success(
        `Campaign ${campaign.isPaused ? "Resumed" : "Paused"} Successfully`
      );
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
          className={`cursor-pointer text-white ${
            campaign.isPaused ? "bg-green-700" : "bg-yellow-700"
          } rounded-md py-1 px-3 flex gap-2 items-center my-auto`}
          onClick={() => {
            setOpen(true);
          }}
        >
          {campaign.isPaused ? (
            <>
              <Play fill="white" size={18} /> Resume
            </>
          ) : (
            <>
              <Pause fill="white" size={18} /> Pause
            </>
          )}
        </button>
      </div>
      <Modal
        className={"flex flex-col gap-6 bg-white rounded-lg border p-6"}
        open={open}
        close={() => setOpen(false)}
      >
        <p className="font-medium text-2xl">Alert</p>
        <div className="flex items-center justify-center h-48 px-8">
          Are you sure you want to {campaign.isPaused ? "Resume" : "Pause"}?
        </div>
        <button
          className="text-white px-4 py-2 font-medium bg-purple-700 ml-auto rounded-md"
          onClick={handleDelete}
        >
          {loading ? (
            <Loader2 className="animate-spin text-white" />
          ) : campaign.isPaused ? (
            "Resume"
          ) : (
            "Pause"
          )}
        </button>
      </Modal>
    </>
  );
};

export default PauseModal;
