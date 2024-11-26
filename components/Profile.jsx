"use client";
import { MyContext } from '@/context/MyContext'
import React, { useContext, useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal';

const AdminProfile = () => {
    const {user} = useContext(MyContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const inputClassName =
    "mt-1 block w-full rounded-3xl py-1 px-4 bg-oohpoint-grey-200 font-light w-[20rem]";
  const buttonClassName =
    "bg-oohpoint-primary-2 text-white font-semibold px-5 py-2 rounded-lg mt-2 hover:scale-90 transition-all";

  return (
    <div className="bg-oohpoint-grey-200 w-full h-full flex flex-col justify-start items-start mt-2">
      <div className="flex justify-between items-center w-full lg:px-8 py-4 gap-1 px-5">
        <div className="flex flex-col items-start justify-center ">
          <h1 className="text-oohpoint-grey-500 font-bold text-4xl">
            Welcome {user?.name}!
          </h1>
          <p className="text-oohpoint-tertiary-2 font-medium">
            Your admin profile
          </p>
        </div>
        {/* <button onClick={openModal} className="bg-oohpoint-primary-2 hover:bg-oohpoint-primary-3 text-white py-2 px-6 rounded-xl hover:scale-95 transition-all">
          Change Password
        </button> */}
      </div>

      <div className="bg-white h-full p-10 rounded-2xl w-full flex gap-4 justify-around items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Admin ID */}
          <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">Name:</label>
            <input
              type="text"
              value={user?.name}
              className={inputClassName}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">UID:</label>
            <input
              type="text"
              value={user?.uid}
              className={inputClassName}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">Admin ID:</label>
            <input
              type="text"
              value={user?.adminId}
              className={inputClassName}
              disabled
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">Email:</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className={inputClassName}
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">Role:</label>
            <input
              type="text"
              value={user?.role}
              className={inputClassName}
              style={{ textTransform: "capitalize" }}
              disabled
            />
          </div>

          {/* Profile Image */}
          {/* <div className="mb-4">
            <label className="block text-oohpoint-primary-2 text-lg">Profile Image:</label>
            <div className="size-48 mb-4 relative">
              {user?.imageUrl ? (
                <img
                  className="w-full h-full object-cover rounded-full shadow-lg"
                  src={user?.imageUrl}
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full" />
              )}
            </div>
          </div> */}

        </div>
      </div>
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  )
}

export default AdminProfile;
