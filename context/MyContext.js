"use client";
import React, { createContext, use, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isEditCampaign, setIsEditCampaign] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState(null);
  const [mode, setMode] = useState("");
  const [blog, setBlog] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [qrs, setQrs] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (!user) {
        toast.error("Log in first");
        router.push("/sign-in"); // Adjust the route as per your application
      } else {
        fetchUser(user.uid);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const fetchUser = async (uid) => {
    try {
      const res = await fetch("/api/getAdmins");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      console.log(userData);
      const data = userData.find((user) => user.uid === uid);
      console.log(data);
      setUser(data);
      fetchCampaigns();
      fetchVendors();
      fetchBrands();
      fetchUsers();
      fetchBlogs();
      fetchAdmins();
      fetchQr();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/getVendors");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setVendors(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/getBrands");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setBrands(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/getUsers");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/getCampaigns");

      if (!res.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const campaignsData = await res.json();

      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/getBlogs");

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const blogsData = await res.json();

      setBlogs(blogsData.reverse());
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/getAdmins");

      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }

      const blogsData = await res.json();

      setAdmins(blogsData.reverse());
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchQr = async () => {
    try {
      const res = await fetch("/api/getQr");

      if (!res.ok) {
        throw new Error("Failed to fetch qrs");
      }

      const qrsData = await res.json();

      setQrs(qrsData);
    } catch (error) {
      console.error("Error fetching qrs:", error);
    }
  };

  return (
    <MyContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isHovered,
        setIsHovered,
        user,
        setUser,
        campaigns,
        setCampaigns,
        vendors,
        setVendors,
        brands,
        setBrands,
        users,
        setUsers,
        fetchVendors,
        fetchBrands,
        fetchCampaigns,
        fetchUsers,
        blogs,
        setBlogs,
        fetchBlogs,
        isEditCampaign,
        setIsEditCampaign,
        editedCampaign,
        setEditedCampaign,
        mode,
        setMode,
        blog,
        setBlog,
        admins,
        setAdmins,
        fetchAdmins,
        qrs,
        setQrs,
        fetchQr,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
