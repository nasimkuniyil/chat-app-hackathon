import React, { useState } from "react";
import { ButtonSM, IconButton } from "../../../components/buttons";
import { BsThreeDots } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { useAuth } from "../../../features/useAuth";
import ThreeDotMenu from "../../../components/ThreeDotMenu";
import Modal from "../../../components/Modal";
import Profile from "../../../components/Profile";
import Notifications from "../../../components/Notifications";

const Header = ({ user }) => {
  const { logout } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4">
      <div className=" flex justify-between items-center">
        {/* Left side - User info */}
        <div className="flex items-center space-x-4">
          {/* User avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-md">
              {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User details */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              {user?.name || user?.username}
            </h1>
            {/* <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 font-medium">Online</span>
            </div> */}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <IconButton onClick={() => setNotificationOpen(true)}>
            <FaRegBell />
          </IconButton>
          {/* Profile modal example */}
          <button
            onClick={() => setProfileOpen(true)}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
          >
            Profile
          </button>
          {/* <ThreeDotMenu /> */}
        </div>
      </div>
      <Modal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} title="Profile">
        <Profile user={user} handleLogout={handleLogout} setProfileOpen={setProfileOpen} />
      </Modal>
      <Modal isOpen={isNotificationOpen} onClose={() => setNotificationOpen(false)} title="Notifications">
        <Notifications />
      </Modal>
    </header>
  );
};

export default Header;

