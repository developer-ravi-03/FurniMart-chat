import React from "react";
import { useChatContext } from "../../context/ChatContext";

const ChatList = ({ title, chats, type }) => {
  const { loadChatMessages, createNewChat, user } = useChatContext();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>{title}</h3>
        {user && user.role === "customer" && (
          <button onClick={createNewChat} className="new-chat-btn">
            New Chat
          </button>
        )}
      </div>
      <div className="chat-list-items">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              className="chat-item"
              onClick={() => loadChatMessages(chat.chatId)}
            >
              <div className="chat-item-header">
                <span className="chat-id">{chat.chatId}</span>
                <span className={`status ${chat.status || "active"}`}>
                  {chat.status || "Active"}
                </span>
              </div>
              <div className="chat-item-body">
                {type === "active" && (
                  <div className="customer-info">
                    Customer: {chat.customer?.name || "Unknown"}
                  </div>
                )}
                <div className="last-message">
                  {chat.lastMessage?.content.substring(0, 30)}
                  {chat.lastMessage?.content.length > 30 ? "..." : ""}
                </div>
                <div className="timestamp">
                  {formatDate(chat.updatedAt || chat.createdAt)}
                </div>
                {type === "active" && (
                  <div className="assigned-to">
                    {chat.assignedTo
                      ? `Assigned to: ${chat.assignedTo.name}`
                      : "Unassigned"}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats">No chats available</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
