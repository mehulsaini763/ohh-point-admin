// "use client"
import React, { useContext, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { MyContext } from "@/context/MyContext";

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { fetchAdmins } = useContext(MyContext);

  const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light";
  const buttonClassName =
    "bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all";

  const uploadImage = async () => {
    try {
      // Prepare to upload the profile picture
      const profileRef = ref(storage, `admins/${profilePicture.name}`);

      // Upload the file
      await uploadBytes(profileRef, profilePicture);

      // Get the download URL for the uploaded image
      const profileUrl = await getDownloadURL(profileRef);
      return profileUrl;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const profileUrl = await uploadImage();
    try {
      const response = await fetch("/api/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          imageUrl: profileUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      fetchAdmins();
    }
  };

  return (
    <div className="bg-white h-full overflow-y-scroll p-6 rounded-lg w-full">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClassName}
            placeholder="Enter admin's name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClassName}
            placeholder="Enter admin's email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            className={inputClassName}
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="" disabled>
              Select a Role
            </option>
            <option value="admin">Admin</option>
            <option value="content">Content</option>
            <option value="helpdesk">Helpdesk</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block text-oohpoint-primary-2 text-lg">Profile Picture:</label>
          <div className="flex gap-1 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              required
              className={inputClassName}
            />
            {profilePicture && (
              <img
                className="size-11 hover:scale-[5] hover:rounded-sm transition-all duration-300 mt-1 shadow-md rounded-lg"
                src={URL.createObjectURL(profilePicture)}
                alt="Profile Preview"
              />
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreateAdmin}
          className={buttonClassName}
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Admin..." : "Create Admin"}
        </button>
      </div>
    </div>
  );
};

export default CreateAdmin;
