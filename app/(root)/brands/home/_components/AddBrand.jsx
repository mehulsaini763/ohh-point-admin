// "use client"
import React, { useContext, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { MyContext } from "@/context/MyContext";
import Modal from "@/components/Modal";

const AddBrand = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscription, setSubscription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const { fetchBrands } = useContext(MyContext);

  const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light";
  const buttonClassName =
    "bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all";

  const uploadImage = async (e) => {
    try {
      // Prepare to upload the logo
      const logoRef = ref(storage, `logos/${logo.name}`);

      // Upload the file
      await uploadBytes(logoRef, logo);

      // Get the download URL for the uploaded logo
      const logoUrl = await getDownloadURL(logoRef);
      return logoUrl;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const logoUrl = await uploadImage();
    console.log(logoUrl);
    try {
      const response = await fetch("/api/createBrand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify({
          // Stringify the body object
          email,
          password,
          name,
          businessName,
          brandName,
          logo: logoUrl,
          subscription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(data.message); // Show success message
    } catch (err) {
      setError(err.message); // Show error message
    } finally {
      setLoading(false); // Reset loading state
      fetchBrands(); // Fetch brands again to update the list
    }
  };

  return (
    <>
      <button
        className="bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white py-2 px-6 rounded-lg hover:scale-95 transition-all"
        onClick={() => setOpen(true)}
      >
        Add Brand
      </button>
      <Modal open={open} close={() => setOpen(false)}>
        <div className="bg-white h-full overflow-y-scroll p-6 rounded-lg w-full">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Name of POC */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Name of POC:
              </label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter name of POC"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter client's email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className={inputClassName}
              />
            </div>

            {/* Subscription */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Subscription
              </label>
              <select
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                className={inputClassName}
                required
              >
                <option value="" disabled>
                  Select A Subscription
                </option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Business Name:
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter business name"
              />
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Brand Name:
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter brand name"
              />
            </div>

            {/* Brand Logo */}
            <div>
              <label className="block text-oohpoint-primary-2 md:text-lg">
                Brand Logo:
              </label>
              <div className="flex gap-1 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files[0])}
                  required
                  className={inputClassName}
                />
                {logo && (
                  <img
                    className="size-11 hover:scale-[5] hover:rounded-sm transition-all duration-300 mt-1 shadow-md rounded-lg"
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCreateUser}
              className={buttonClassName}
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Brand..." : "Add Brand"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddBrand;
