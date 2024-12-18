"use client";
import { MyContext } from "@/context/MyContext";
import { storage } from "@/firebase";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // For accessing query params
import { Timestamp } from "firebase/firestore";

const CreateCampaign = ({ isEdit, campaign }) => {
  const [campaignName, setCampaignName] = useState("");
  const [moq, setMoq] = useState("");
  const [ta, setTa] = useState("");
  const [targetAudience, setTargetAudience] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [geoTarget, setGeoTarget] = useState("");
  const [geoTargets, setGeoTargets] = useState([]);
  const [qrTag, setQrTag] = useState("");
  const [qrTags, setQrTags] = useState([]);
  const [placementChannel, setPlacementChannel] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [objective, setObjective] = useState("");
  const [reportFreq, setReportFreq] = useState("");
  const [adCreativeImage, setAdCreativeImage] = useState(null);
  const [adVideo, setAdVideo] = useState(null);
  const [redirectLink, setRedirectLink] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: "",
      options: [""],
      correctOption: null, // Index of the correct option
    },
  ]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchCampaigns, setIsEditCampaign } = useContext(MyContext);
  const router = useRouter();

  const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light";

  const addQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: "", options: [""] }]);
  };

  const removeQuestion = (index) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const addOption = (index) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index].options.push("");
    setQuizQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuizQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index].question = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizQuestions(updatedQuestions);
  };

  const fetchClients = async () => {
    const res = await fetch("/api/getBrands");

    if (!res.ok) {
      throw new Error("Failed to fetch clients");
    }

    const data = await res.json();
    setClients(data.reverse());
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (isEdit && campaign) {
      setCampaignName(campaign.campaignName);
      setMoq(campaign.moq);
      setTargetAudience(campaign.targetAudience);
  
      // Convert Firestore Timestamp to 'YYYY-MM-DD' format for input
      const formattedStartDate = new Date(campaign.startDate.seconds * 1000).toISOString().split("T")[0];
      const formattedEndDate = new Date(campaign.endDate?.seconds * 1000).toISOString().split("T")[0];

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
  
      setGeoTargets(campaign.geographicTargeting);
      setQrTags(campaign.qrCodeTags);
      setPlacementChannel(campaign.placementChannel);
      setClient(campaign.client);
      setBudget(campaign.campaignBudget);
      setObjective(campaign.campaignObjectives);
      setReportFreq(campaign.reportingFrequency);
      setRedirectLink(campaign.redirectLink);
      setQuizQuestions(campaign.quizQuestions);
    }
  }, [isEdit, campaign]);

  const formatToFirestoreTimestamp = (date) => {
    if (date && date.toDate) {
      // If it's already a Firestore Timestamp, return it
      return date;
    } else if (date instanceof Date) {
      // If it's a JavaScript Date, convert it to Firestore Timestamp
      return Timestamp.fromDate(date);
    } else if (typeof date === "string" || date instanceof String) {
      // If it's a string, convert it to Date and then to Firestore Timestamp
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? null : Timestamp.fromDate(parsedDate);
    }
    return null; // Return null if date is invalid or not set
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let adCreativeUrl = campaign?.adCreative || null;
    let advertisingVideoUrl = campaign?.advertisingVideo || null;
  
    try {
      // Check if a new image has been uploaded
      if (adCreativeImage && adCreativeImage !== campaign?.adCreative) {
        const adCreativeRef = storageRef(
          storage,
          `adCreatives/${adCreativeImage.name}`
        );
        const adCreativeSnapshot = await uploadBytes(adCreativeRef, adCreativeImage);
        adCreativeUrl = await getDownloadURL(adCreativeRef);
      }
  
      // Check if a new video has been uploaded
      if (adVideo && adVideo !== campaign?.advertisingVideo) {
        const advertisingVideoRef = storageRef(
          storage,
          `advertisingVideos/${adVideo.name}`
        );
        const advertisingVideoSnapshot = await uploadBytes(advertisingVideoRef, adVideo);
        advertisingVideoUrl = await getDownloadURL(advertisingVideoRef);
      }
    } catch (error) {
      console.error("Error during file upload:", error.message || error);
      toast.error("Error uploading files. Please try again.");
      setLoading(false);
      return;
    }
  
    // Format dates for Firestore storage
    const formattedStartDate = formatToFirestoreTimestamp(startDate);
    const formattedEndDate = formatToFirestoreTimestamp(endDate);
  
    const campaignData = {
      campaignName,
      moq,
      targetAudience,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      geographicTargeting: geoTargets,
      qrCodeTags: qrTags,
      placementChannel,
      client,
      campaignBudget: budget,
      campaignObjectives: objective,
      reportingFrequency: reportFreq,
      advertisingVideo: advertisingVideoUrl,
      adCreative: adCreativeUrl,
      redirectLink,
      quizQuestions,
    };
  
    try {
      let response;
      if (isEdit) {
        // Update existing campaign
        response = await fetch(`/api/updateCampaign/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cid: campaign.cid, ...campaignData }),
        });
      } else {
        // Create new campaign
        response = await fetch("/api/createCampaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(campaignData),
        });
      }
  
      const result = await response.json();
      if (response.ok) {
        toast.success(isEdit ? "Campaign updated successfully" : "Campaign created successfully");
        // router.push("/campaigns");
      } else {
        toast.error(result.message || "Failed to save campaign");
      }
    } catch (error) {
      console.error("Error creating/updating campaign:", error);
      toast.error("An error occurred while saving the campaign.");
    } finally {
      setLoading(false);
      fetchCampaigns();
      setIsEditCampaign(false);
    }
  };
  
  return (
    <div className="w-full grid gap-8 grid-cols-4 p-4 pb-8 bg-white rounded-2xl">
      {/* Campaign Name */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Campaign Name</label>
        <input
          className={inputClassName}
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
        />
      </div>

      {/* MOQ */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">MOQ</label>
        <input
          className={inputClassName}
          type="number"
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          placeholder="Enter MOQ"
        />
      </div>

      {/* Target Audience */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Target Audience</label>
        <input
          className={inputClassName}
          type="text"
          value={ta}
          onChange={(e) => setTa(e.target.value)}
          placeholder="Enter target audience"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setTa("");
              setTargetAudience([...targetAudience, e.target.value]);
            }
          }}
        />
        <div className="mt-1 flex flex-wrap w-full mb-2 border border-gray-300 justify-start items-center rounded-md ">
          {targetAudience.length > 0 &&
            targetAudience.map((ta, index) => (
              <span
                className="cursor-pointer border bg-white py-1 px-4 m-2 border-primary rounded-full"
                key={index}
                onClick={() =>
                  setTargetAudience(targetAudience.filter((tg) => tg !== ta))
                }
              >
                {ta}
              </span>
            ))}
        </div>
      </div>

      {/* Start Date */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClassName}
        />
      </div>

      {/* End Date */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputClassName}
        />
      </div>

      {/* Geographic Targeting */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Geographic Targeting</label>
        <input
          className={inputClassName}
          type="text"
          value={geoTarget}
          onChange={(e) => setGeoTarget(e.target.value)}
          placeholder="Enter geographic targeting"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setGeoTarget("");
              setGeoTargets([...geoTargets, e.target.value]);
            }
          }}
        />
        <div className="mt-1 flex flex-wrap w-full mb-2 border border-gray-300 justify-start items-center rounded-md ">
          {geoTargets.length > 0 &&
            geoTargets.map((gt, index) => (
              <span
                className="cursor-pointer border bg-white py-1 px-4 m-2 border-primary rounded-full"
                key={index}
                onClick={() => setGeoTargets(geoTargets.filter((tg) => tg !== gt))}
              >
                {gt}
              </span>
            ))}
        </div>
      </div>

      {/* QR Code Tags */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">QR Code Tags</label>
        <input
          className={inputClassName}
          type="text"
          value={qrTag}
          onChange={(e) => setQrTag(e.target.value)}
          placeholder="Enter QR code tags"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setQrTag("");
              setQrTags([...qrTags, e.target.value]);
            }
          }}
        />
        <div className="mt-1 flex flex-wrap w-full mb-2 border border-gray-300 justify-start items-center rounded-md ">
          {qrTags.length > 0 &&
            qrTags.map((tag, index) => (
              <span
                className="cursor-pointer border bg-white py-1 px-4 m-2 border-primary rounded-full"
                key={index}
                onClick={() => setQrTags(qrTags.filter((tg) => tg !== tag))}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Placement Channel Dropdown */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Placement Channel</label>
        <select
          value={placementChannel}
          onChange={(e) => setPlacementChannel(e.target.value)}
          className={inputClassName}
        >
          <option value="" disabled>
            Select a channel
          </option>
          <option value="mineralWater">Mineral Water</option>
          <option value="carbonatedWater">Carbonated Water</option>
          <option value="energyDrink">Energy Drink</option>
          <option value="fruitJuices">Fruit Juices</option>
        </select>
      </div>

      {/* Client Dropdown */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Client</label>
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className={inputClassName}
        >
          <option value="" disabled>
            Select a client
          </option>
          {clients.map((cl) => (
            <option value={cl.brandId} key={cl.brandId}>
              {cl.brandName} - {cl.brandId}
            </option>
          ))}
        </select>
      </div>

      {/* Campaign Budget */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Campaign Budget</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter campaign budget"
          className={inputClassName}
        />
      </div>

      {/* Campaign Objective */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Campaign Objective</label>
        <input
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Enter campaign objective"
          className={inputClassName}
        />
      </div>

      {/* Reporting Frequency */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Reporting Frequency</label>
        <input
          type="text"
          value={reportFreq}
          onChange={(e) => setReportFreq(e.target.value)}
          placeholder="Enter reporting frequency"
          className={inputClassName}
        />
      </div>

      {/* Ad Creative Image */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Ad Creative Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAdCreativeImage(e.target.files[0])}
          className={inputClassName}
        />
      </div>

      {/* Advertising Video */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Advertising Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setAdVideo(e.target.files[0])}
          className={inputClassName}
        />
      </div>

      {/* Redirect Link */}
      <div className="">
        <label className="block text-oohpoint-primary-2 text-lg">Redirect Link</label>
        <input
          type="url"
          value={redirectLink}
          onChange={(e) => setRedirectLink(e.target.value)}
          placeholder="https://"
          className={inputClassName}
        />
      </div>

      {/* MCQ Quiz Questions */}
      <div className="col-span-2">
        <label className="block text-oohpoint-primary-2 text-lg">Quiz Questions</label>
        {quizQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="Enter question"
              className={inputClassName}
            />
            <div className="mt-2">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                    className={`mr-2 ${inputClassName}`}
                  />
                  <label className="ml-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={question.correctOption === optIndex}
                      onChange={() => {
                        const updatedQuestions = [...quizQuestions];
                        updatedQuestions[index].correctOption = optIndex;
                        setQuizQuestions(updatedQuestions);
                      }}
                    />
                    Correct
                  </label>
                  <button
                    className="ml-2 p-2 py-1 bg-red-500 text-white rounded-lg"
                    onClick={() => removeOption(index, optIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="mt-2 p-2 py-1 bg-blue-500 text-white rounded-lg"
                onClick={() => addOption(index)}
              >
                Add Option
              </button>
            </div>
            <button
              className="mt-2 p-2 py-1 bg-red-500 text-white rounded-lg"
              onClick={() => removeQuestion(index)}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          className="mt-2 p-2 py-1 bg-green-500 text-white rounded-lg"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>

      <div className="flex justify-end flex-col gap-3">
        <button
          className="bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Campaign" : "Create Campaign"}
        </button>
      </div>
    </div>
  );
};

export default CreateCampaign;
