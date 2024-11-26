import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { qid, ...updatedCampaign } = req.body;

    if (!qid) {
      return res.status(400).json({ message: "Qr ID is required." });
    }

    try {
      const campaignRef = doc(db, "qrs", qid);
      await updateDoc(campaignRef, updatedCampaign);

      res.status(200).json({ message: "QR updated successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
