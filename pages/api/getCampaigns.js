import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Reference to the campaigns collection
      const campaignsCollection = collection(db, "campaigns");
      const campaignQuery = query(
        campaignsCollection,
        orderBy("cid", "desc")
      );
      // Fetch all campaign documents
      const campaignSnapshot = await getDocs(campaignQuery);
      const campaigns = [];

      // Loop through the documents and push to the campaigns array
      campaignSnapshot.forEach((doc) => {
        campaigns.push({ id: doc.id, ...doc.data() });
      });

      // Return the campaigns data as JSON
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
