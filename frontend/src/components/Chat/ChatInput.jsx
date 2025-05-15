import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, currentChat, user } = useChatContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  if (!currentChat || !user) return null;

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        className="chat-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
      />
      <button type="submit" className="send-button" disabled={!message.trim()}>
        Send
      </button>
    </form>
  );
};

export default ChatInput;
