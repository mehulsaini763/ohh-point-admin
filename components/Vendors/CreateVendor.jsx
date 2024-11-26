"use client";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MyContext } from "@/context/MyContext";
import { storage } from "@/firebase";

const CreateVendor = () => {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [closingHours, setClosingHours] = useState("");
  const [operatingDays, setOperatingDays] = useState("");
  const [kycId, setKycId] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [keyProducts, setKeyProducts] = useState("");
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopImage, setShopImage] = useState(null);
  const { fetchVendors } = useContext(MyContext);

  const handleImageChange = (e) => {
    setShopImage(e.target.files[0]);
  };

  const uploadImageToFirebase = async () => {
    if (!shopImage) return null;
    const storageRef = ref(storage, `shopImages/${shopImage.name}`);

    await uploadBytes(storageRef, shopImage);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image to Firebase
      const imageUrl = await uploadImageToFirebase();

      const data = {
        email,
        password,
        businessName,
        ownerName,
        businessCategory,
        phoneNumber,
        whatsapp,
        address: fullAddress,
        googleMapLink,
        openingHours,
        closingHours,
        operatingDays,
        kycId,
        gstNumber,
        registrationNumber,
        accountNumber,
        ifsc,
        upiId,
        keyProducts,
        termsAgreement,
        location: {
          latitude,
          longitude,
        },
        shopImage: imageUrl, // Include the image URL here
      };

      const response = await fetch("/api/createVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Vendor created successfully");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("Error creating vendor");
    } finally {
      setLoading(false);
      fetchVendors();
    }
  };

  const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light";

  return (
    <>
      <div className="container mx-auto py-4 w-[100%] h-auto px-4 pb-8 bg-white rounded-2xl">
        <form onSubmit={handleSubmit} className=" pb-8">
          <div className="grid grid-cols-4 gap-6 pb-8">
            {/* Business Information */}
            {/* <div className="col-span-4">
              <h2 className="text-lg font-bold">Business Information</h2>
            </div> */}
            <div>
              <label className="block text-oohpoint-primary-2 text-lg ">
                Business Name
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
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Owner's Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter owner's name"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Business Category
              </label>
              <input
                type="text"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                required
                className={inputClassName}
                placeholder="e.g., Grocery, Medical"
              />
            </div>

            {/* Contact Information */}
            {/* <div className="col-span-4">
              <h2 className="text-lg font-bold">Contact Information</h2>
            </div> */}
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                WhatsApp (Optional)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={inputClassName}
                placeholder="Enter WhatsApp number"
              />
            </div>
            <div className="">
              <label className="block text-oohpoint-primary-2 text-lg">
                Shop Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                required
                className={inputClassName}
              />
            </div>

            {/* Address Information */}
            {/* <div className="col-span-4">
              <h2 className="text-lg font-bold">Address Information</h2>
            </div> */}
            <div className="col-span-2">
              <label className="block text-oohpoint-primary-2 text-lg">
                Full Address
              </label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter full address"
              />
            </div>

            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter longitude"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-oohpoint-primary-2 text-lg">
                Google Map Link (Optional)
              </label>
              <input
                type="text"
                value={googleMapLink}
                onChange={(e) => setGoogleMapLink(e.target.value)}
                className={inputClassName}
                placeholder="Enter Google map link"
              />
            </div>

            {/* Additional Information */}
            {/* <div className="col-span-4">
              <h2 className="text-lg font-bold">Additional Information</h2>
            </div> */}
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Opening Hours
              </label>
              <input
                type="time"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Closing Hours
              </label>
              <input
                type="time"
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Operating Days
              </label>
              <input
                type="text"
                value={operatingDays}
                onChange={(e) => setOperatingDays(e.target.value)}
                required
                className={inputClassName}
                placeholder="e.g., Mon-Fri"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Aadhar/Pan/Voter ID Number
              </label>
              <input
                type="text"
                value={kycId}
                onChange={(e) => setKycId(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter KYC ID"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                GST Number
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter GST number"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter IFSC code"
              />
            </div>
            <div>
              <label className="block text-oohpoint-primary-2 text-lg">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className={inputClassName}
                placeholder="Enter UPI ID"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-oohpoint-primary-2 text-lg">
                Registration Number (if applicable)
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className={inputClassName}
                placeholder="Enter Registration Number"
              />
            </div>

            <div className="col-span-4">
              {/* <h2 className="text-lg font-bold">Services Offered</h2> */}
            </div>
            <div className="col-span-2">
              <label className="block text-oohpoint-primary-2 text-lg">
                Key Products/Services
              </label>
              <textarea
                value={keyProducts}
                onChange={(e) => setKeyProducts(e.target.value)}
                required
                className={inputClassName}
                placeholder="Enter a brief list of products or services"
              />
            </div>

            {/* Terms Agreement */}
            <div className="col-span-4 flex items-center">
              <input
                type="checkbox"
                id="termsAgreement"
                checked={termsAgreement}
                onChange={(e) => setTermsAgreement(e.target.checked)}
                required
              />
              <label
                htmlFor="termsAgreement"
                className="ml-2 text-oohpoint-primary-2"
              >
                I agree to the terms and conditions.
              </label>
            </div>
          </div>

          <button
            className="bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateVendor;
