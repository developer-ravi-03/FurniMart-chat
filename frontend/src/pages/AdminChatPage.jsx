import React, { useState } from "react";
import UserListSidebar from "../components/Chat/UserListSidebar";
import ChatContainer from "../components/Chat/ChatContainer";

const AdminChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
    setShowChat(true); // Show chat on mobile when user is selected
  };

  const handleBackToSidebar = () => {
    setShowChat(false); // Go back to sidebar on mobile
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div
        className={`${
          showChat ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 flex-shrink-0`}
      >
        <UserListSidebar
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
        />
      </div>

      {/* Chat Container - Hidden on mobile when no user selected */}
      <div
        className={`${!showChat ? "hidden md:flex" : "flex"} flex-1 flex-col`}
      >
        <ChatContainer
          selectedUser={selectedUser}
          onBackToSidebar={handleBackToSidebar}
          showMobileBackButton={showChat}
        />
      </div>
    </div>
  );
};

export default AdminChatPage;
