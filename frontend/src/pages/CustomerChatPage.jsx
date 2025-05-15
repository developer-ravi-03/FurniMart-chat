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
      <div className="p-4 border-b bg-white font-bold text-lg">
        Support Chat
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
