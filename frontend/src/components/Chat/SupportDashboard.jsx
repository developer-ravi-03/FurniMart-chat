import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";

const SupportDashboard = () => {
  const { activeChats, assignChat, resolveChat, user, loadChatMessages } =
    useChatContext();

  const [selectedChat, setSelectedChat] = useState(null);

  if (!user || (user.role !== "support" && user.role !== "admin")) {
    return <div>Access denied. Support staff only.</div>;
  }

  const handleAssignToMe = async (chatId) => {
    await assignChat(chatId, user._id);
    loadChatMessages(chatId);
  };

  const handleResolveChat = async (chatId) => {
    await resolveChat(chatId);
    setSelectedChat(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="support-dashboard">
      <h2>Support Dashboard</h2>

      <div className="active-chats-container">
        <h3>Active Chats ({activeChats.length})</h3>
        <table className="chats-table">
          <thead>
            <tr>
              <th>Chat ID</th>
              <th>Customer</th>
              <th>Created</th>
              <th>Last Message</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeChats.map((chat) => (
              <tr
                key={chat.chatId}
                className={selectedChat === chat.chatId ? "selected" : ""}
                onClick={() => {
                  setSelectedChat(chat.chatId);
                  loadChatMessages(chat.chatId);
                }}
              >
                <td>{chat.chatId}</td>
                <td>{chat.customer?.name || "Unknown"}</td>
                <td>{formatDate(chat.createdAt)}</td>
                <td>
                  {chat.lastMessage?.content.substring(0, 20)}
                  {chat.lastMessage?.content.length > 20 ? "..." : ""}
                </td>
                <td>{chat.lastMessage?.status || "Unknown"}</td>
                <td>{chat.assignedTo ? chat.assignedTo.name : "Unassigned"}</td>
                <td>
                  {!chat.assignedTo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignToMe(chat.chatId);
                      }}
                      className="action-btn assign-btn"
                    >
                      Assign to me
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveChat(chat.chatId);
                    }}
                    className="action-btn resolve-btn"
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
            {activeChats.length === 0 && (
              <tr>
                <td colSpan="7" className="no-chats">
                  No active chats
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportDashboard;
