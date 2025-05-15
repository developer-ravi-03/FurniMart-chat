import React, { useEffect, useRef } from "react";
import { useChatContext } from "../../context/ChatContext";

const MessagesList = () => {
  const { messages, currentChat, user, markAsRead } = useChatContext();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    if (!user || !messages.length) return;

    const unreadMessages = messages.filter(
      (msg) =>
        msg.status !== "read" &&
        msg.sender._id !== user._id &&
        msg.receiver !== "support"
    );

    unreadMessages.forEach((msg) => {
      markAsRead(msg._id);
    });
  }, [messages, user, markAsRead]);

  const formatTime = (date) => {
    const msgDate = new Date(date);
    return msgDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUserSender = (senderId) => {
    return user && user._id === senderId;
  };

  return (
    <div className="messages-list">
      <div className="messages-header">
        <h3>Chat ID: {currentChat}</h3>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              isCurrentUserSender(message.sender._id) ? "sent" : "received"
            }`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-footer">
              <span className="sender-name">{message.sender.name}</span>
              <span className="message-time">
                {formatTime(message.createdAt)}
              </span>
              <span className={`message-status ${message.status}`}>
                {message.status}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesList;
