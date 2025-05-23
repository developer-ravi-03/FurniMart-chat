import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import MessageList from "../components/Chat/MessageList";
import InputContainer from "../components/Chat/InputContainer";
import { UserData } from "../context/UserContext";

const CustomerChatPage = () => {
  const { chatId } = useParams();
  const { user } = UserData();
  const { messages, loadChatMessages, sendMessage, loading, error } =
    useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (chatId) {
      loadChatMessages(chatId);
    }
  }, [chatId, navigate]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">No chat selected.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-2  bg-white border-b border-gray-200 shadow-sm font-bold text-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Support Chat
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Online Support</span>
            </div>
          </div>
        </div>
      </div>
      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 text-center">{error}</div>
      )}
      {/* Message list */}
      <MessageList messages={messages} user={user} />
      {/* Input field */}
      <InputContainer onSend={sendMessage} disabled={loading} />
    </div>
  );
};

export default CustomerChatPage;
