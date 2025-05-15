import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { UserData } from "./UserContext";

// Create context
const ChatContext = createContext(null);

// Custom hook for consuming context
export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = UserData();
  // State
  const [activeChats, setActiveChats] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ...existing code...

  // Fetch active chats (for support/admin)
  const fetchActiveChats = async () => {
    if (!user || (user.role !== "support" && user.role !== "admin")) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/chat/active");
      setActiveChats(res.data);
    } catch (err) {
      setError("Failed to load active chats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history (for current user)
  const fetchChatHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/chat/history");
      setChatHistory(res.data);
    } catch (err) {
      setError("Failed to load chat history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a chat
  const loadChatMessages = async (chatId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/chat/messages/${chatId}`);
      setMessages(res.data);
      setCurrentChat(chatId);
    } catch (err) {
      setError("Failed to load chat messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/chat/create");
      const { chatId } = res.data;
      await loadChatMessages(chatId);
      await fetchChatHistory();
      return chatId;
    } catch (err) {
      setError("Failed to create new chat");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (content) => {
    if (!currentChat || !content.trim()) return;
    try {
      const messageData = {
        chatId: currentChat,
        content,
        receiver: user.role === "customer" ? "support" : "customer",
      };
      const res = await axios.post("/api/chat/send", messageData);
      setMessages((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
      return null;
    }
  };

  // Assign chat
  const assignChat = async (chatId, userId) => {
    if (!user || (user.role !== "support" && user.role !== "admin")) return;
    try {
      const res = await axios.put(`/api/chat/assign/${chatId}`, { userId });
      setActiveChats((prev) =>
        prev.map((chat) =>
          chat.chatId === chatId
            ? { ...chat, assignedTo: res.data.assignedTo }
            : chat
        )
      );
      return res.data;
    } catch (err) {
      setError("Failed to assign chat");
      console.error(err);
      return null;
    }
  };

  // Resolve chat
  const resolveChat = async (chatId) => {
    try {
      const res = await axios.put(`/api/chat/resolve/${chatId}`);
      setActiveChats((prev) => prev.filter((chat) => chat.chatId !== chatId));
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.chatId === chatId ? { ...chat, status: "resolved" } : chat
        )
      );
      return res.data;
    } catch (err) {
      setError("Failed to resolve chat");
      console.error(err);
      return null;
    }
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const res = await axios.put(`/api/chat/read/${messageId}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        )
      );
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Context value
  const contextValue = {
    activeChats,
    chatHistory,
    currentChat,
    messages,
    loading,
    error,
    user,
    fetchActiveChats,
    fetchChatHistory,
    loadChatMessages,
    createNewChat,
    sendMessage,
    assignChat,
    resolveChat,
    markAsRead,
    clearError,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
