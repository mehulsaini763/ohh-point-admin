import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const campaignsCollection = collection(db, "qrs");

      const campaignSnapshot = await getDocs(campaignsCollection);
      const campaigns = [];

      campaignSnapshot.forEach((doc) => {
        campaigns.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
