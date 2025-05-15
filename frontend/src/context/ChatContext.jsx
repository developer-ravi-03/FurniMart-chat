import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { UserData } from "./UserContext";

// Create context
const ChatContext = createContext(null);
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
  //this is not in routes section so it dont work
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
    clearError,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
