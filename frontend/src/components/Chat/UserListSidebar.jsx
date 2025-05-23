import React, { useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import {
  Users,
  MessageSquare,
  Search,
  ChevronRight,
  UserCircle,
} from "lucide-react";

const UserListSidebar = ({ onSelectUser, selectedUser }) => {
  const { activeChats, fetchActiveChats, user } = useChatContext();

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "support")) {
      fetchActiveChats();
    }
  }, [user]);

  return (
    <div className="w-full bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Active Users
            </h2>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {activeChats.length}
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {activeChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare size={40} className="text-gray-300 mb-2" />
            <p className="text-gray-400 font-medium">No active chats</p>
            <p className="text-gray-400 text-sm mt-1">
              Active conversations will appear here
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activeChats.map((chat) => (
              <li
                key={chat.chatId}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedUser === chat.customer?._id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
                onClick={() => onSelectUser(chat.customer?._id)}
              >
                <div className="flex items-start p-3 sm:p-4">
                  <div className="flex-shrink-0 mr-3 relative">
                    {chat.customer?.avatar ? (
                      <img
                        src={chat.customer.avatar}
                        alt={chat.customer?.name || "User"}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"
                      />
                    ) : (
                      <UserCircle
                        size={40}
                        className="text-gray-400 sm:w-12 sm:h-12"
                      />
                    )}

                    {chat.isOnline && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">
                        {chat.customer?.name ||
                          chat.customer?.email ||
                          "Unknown User"}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full flex-shrink-0">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <MessageSquare size={12} className="mr-1 flex-shrink-0" />
                      <p className="truncate">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {chat.lastMessage?.timestamp
                          ? formatTimestamp(chat.lastMessage.timestamp)
                          : ""}
                      </span>

                      {selectedUser === chat.customer?._id && (
                        <ChevronRight
                          size={16}
                          className="text-blue-600 hidden sm:block"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 sm:p-3 bg-gray-50 border-t border-gray-200 text-xs text-center text-gray-500">
        {activeChats.length} active conversation
        {activeChats.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export default UserListSidebar;
