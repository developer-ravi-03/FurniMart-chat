import React, { useRef, useEffect } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";

const MessageList = ({ messages, user }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (msgs) => {
    const groups = {};

    msgs.forEach((msg) => {
      const date = new Date(msg.createdAt || Date.now());
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(msg);
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Format timestamp to readable time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for the date divider
  const formatDateDivider = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4">
      {Object.keys(groupedMessages).length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <p>No messages yet</p>
        </div>
      )}

      {Object.keys(groupedMessages).map((dateKey) => (
        <div key={dateKey} className="mb-4 sm:mb-6">
          {/* Date divider */}
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
              {formatDateDivider(dateKey)}
            </div>
          </div>

          {/* Messages for this date */}
          {groupedMessages[dateKey].map((msg, index) => {
            // Safety checks for undefined values
            const senderId = msg.sender?._id || msg.sender;
            const userId = user?.id || user?._id || user;

            const isUser =
              senderId && userId && senderId.toString() === userId.toString();

            const prevSenderId =
              groupedMessages[dateKey][index - 1]?.sender?._id ||
              groupedMessages[dateKey][index - 1]?.sender;
            const isConsecutive =
              index > 0 &&
              prevSenderId &&
              senderId &&
              prevSenderId.toString() === senderId.toString();

            return (
              <div
                key={msg._id}
                className={`mb-1 sm:mb-2 flex ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${
                    isConsecutive ? "mt-1" : "mt-2 sm:mt-3"
                  }`}
                >
                  {/* Message bubble */}
                  <div
                    className={`
                      relative px-3 sm:px-4 py-2 rounded-2xl shadow-sm text-sm sm:text-base
                      ${
                        isUser
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 rounded-bl-none border border-gray-300"
                      }
                    `}
                  >
                    <div className="break-words">{msg.content}</div>

                    {/* Message timestamp */}
                    <div
                      className={`
                        text-xs mt-1 flex items-center justify-end space-x-1
                        ${isUser ? "text-blue-100" : "text-gray-500"}
                      `}
                    >
                      <span>{formatMessageTime(msg.createdAt)}</span>

                      {/* Read status for user messages */}
                      {isUser &&
                        (msg.status === "read" ? (
                          <CheckCheck
                            size={12}
                            className="text-blue-100 flex-shrink-0"
                          />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck
                            size={12}
                            className="text-blue-200 flex-shrink-0"
                          />
                        ) : (
                          <Check
                            size={12}
                            className="text-blue-100 flex-shrink-0"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Sender name for non-user messages if not consecutive */}
                  {!isUser && !isConsecutive && msg.senderName && (
                    <div className="text-xs text-gray-500 ml-2 mt-1 truncate">
                      {msg.senderName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
