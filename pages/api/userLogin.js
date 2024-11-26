import { auth, db } from "@/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    try {
      // Set persistence to 'local' so user doesn't need to sign in again after login
      await setPersistence(auth, browserLocalPersistence);

      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Query Firestore to find the user by Firebase UID
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(404).json({ message: "User not found." });
      }

      // Since there will only be one document, we can grab the first result
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      res.status(200).json({
        message: "Sign-in successful.",
        user: userData,
      });
    } catch (error) {
      if (error.message == "Firebase: Error (auth/invalid-credential).") {
        res.status(404).json({ message: "Invalid email or password." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
