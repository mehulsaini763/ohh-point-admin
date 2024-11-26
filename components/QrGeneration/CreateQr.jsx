"use client";
import { MyContext } from "@/context/MyContext";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

export default function CreateQr({ setActiveSection }) {
  const [title, setTitle] = useState(""); // New field for QR Code title
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchQr } = useContext(MyContext);

  const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light";
  const buttonClassName =
    "bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all";

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(
      storage,
      `qr-backgrounds/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !link) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
    //   const imageUrl = await uploadImageToFirebase(image);

      const payload = {
        title, // Include the title
        link,
        totalScans: [],
        uniqueScans: [],
      };

      const res = await fetch("/api/createQr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("QR Code generated successfully!");
        setTitle("");
        setLink("");
        fetchQr();
        setActiveSection("home");
      } else {
        toast.error("Failed to create QR Code.");
        console.log(res);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-full overflow-y-scroll p-6 mt-8 rounded-lg w-full">
      <h1 className="text-2xl font-bold text-center mb-5">Generate QR Code</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div className=" flex gap-8 w-full justify-center items-center"> */}
        {/* Background Image */}
        {/* <div className="mb-4 w-1/2">
            <label className="block text-oohpoint-primary-2 text-lg">
              Background Image:
            </label>
            <div className="flex gap-1 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                className={inputClassName}
              />
              {image && (
                <img
                  className="size-11 hover:scale-[5] hover:rounded-sm transition-all duration-300 mt-1 shadow-md rounded-lg"
                  src={URL.createObjectURL(image)}
                  alt="Image Preview"
                />
              )}
            </div>
          </div> */}
        {/* QR Code Title */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">
            QR Code Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClassName}
            placeholder="Enter QR Code title"
          />
        </div>
        {/* </div> */}
        {/* Link */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className={inputClassName}
            placeholder="Enter your link"
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className={buttonClassName} disabled={loading}>
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        </div>
      </form>
    </div>
  );
}
