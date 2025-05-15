import React, { useState } from "react";
import UserListSidebar from "../components/Chat/UserListSidebar";
import ChatContainer from "../components/Chat/ChatContainer";

const AdminChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-gray-200">
      <UserListSidebar
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      <div className="flex-1 flex flex-col">
        <ChatContainer selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default AdminChatPage;
