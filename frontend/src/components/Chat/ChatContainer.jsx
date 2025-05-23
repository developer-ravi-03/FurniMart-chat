import React, { useEffect, useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import MessageList from "./MessageList";
import InputContainer from "./InputContainer";
import {
  User,
  Phone,
  Video,
  MoreHorizontal,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

const ChatContainer = ({ selectedUser }) => {
  const { messages, loadChatMessages, sendMessage, user, activeChats } =
    useChatContext();
  const [showMobileHeader, setShowMobileHeader] = useState(false);

  // Find chat for selectedUser
  const chat = activeChats.find((c) => c.customer?._id === selectedUser);
  const chatId = chat ? chat.chatId : null;
  const customer = chat?.customer;

  useEffect(() => {
    if (chatId) {
      loadChatMessages(chatId);
    }
  }, [chatId]);

  // Handle responsive header toggle
  useEffect(() => {
    const handleResize = () => {
      setShowMobileHeader(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!chatId) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full inline-flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No conversation selected
          </h3>
          <p className="text-gray-500 mb-6">
            Select a user from the sidebar to start or continue a conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 relative">
      {/* Header with user info and actions */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Main header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {showMobileHeader && (
              <button className="md:hidden p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}

            <div className="relative">
              {customer?.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer?.name || "User"}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
              )}

              {chat?.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>

            <div>
              <h2 className="font-bold text-gray-800 text-lg leading-tight">
                {customer?.name || customer?.email || "User"}
              </h2>
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>
                    {chat?.isOnline ? "Online now" : "Last seen 2h ago"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:flex">
              <Phone size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:flex">
              <Video size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <MessageList messages={messages} user={user} />
      </div>

      {/* Input field */}
      <div className="border-t border-gray-200 bg-white">
        <InputContainer onSend={sendMessage} disabled={!chatId} />
      </div>
    </div>
  );
};

export default ChatContainer;
