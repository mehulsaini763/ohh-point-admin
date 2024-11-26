import { db } from "@/firebase"; // Adjust based on your Firebase config
import { setDoc, doc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      link,
      totalScans,
      uniqueScans,
      // image,
      title,
    } = req.body;

    if (
      !link ||
      !totalScans ||
      !uniqueScans ||
      !title
    ) {
      return res.status(400).json({
        message: "Please provide all the required fields.",
      });
    }

    try {
      const qid = `QID${Date.now()}`;
  
      await setDoc(doc(db, "qrs", qid), {
        link,
        totalScans,
        uniqueScans,
        // image,
        title,
        qid,
        createdAt: new Date(),
      });

      res.status(200).json({
        message: "QR created successfully.",
        qid,
      });
    } catch (error) {
      console.error("Error creating QR:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
