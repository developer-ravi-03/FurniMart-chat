import React, { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import ChatList from "./ChatList";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";

const ChatContainer = () => {
  const {
    user,
    activeChats,
    chatHistory,
    fetchActiveChats,
    fetchChatHistory,
    currentChat,
  } = useChatContext();

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      if (user.role === "support" || user.role === "admin") {
        fetchActiveChats();
      }
      fetchChatHistory();
    }
  }, [user, fetchActiveChats, fetchChatHistory]);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        {user && (user.role === "support" || user.role === "admin") && (
          <ChatList title="Active Chats" chats={activeChats} type="active" />
        )}
        <ChatList title="Chat History" chats={chatHistory} type="history" />
      </div>
      <div className="chat-main">
        {currentChat ? (
          <>
            <MessagesList />
            <ChatInput />
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat or create a new one to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
