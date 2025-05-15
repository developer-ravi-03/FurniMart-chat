import React, { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { UserData } from "../context/UserContext";

const Home = () => {
  const { user, loading: userLoading } = UserData();
  const { createNewChat, loading: chatLoading } = useChatContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  // Handle create chat button click for customer
  const handleCreateChat = async () => {
    if (!user) return;
    const chatKey = `chatId_${user._id}`;
    const existingChatId = localStorage.getItem(chatKey);

    if (existingChatId) {
      window.location.href = `/chat/${existingChatId}`;
    } else {
      const chatId = await createNewChat();
      if (chatId) {
        localStorage.setItem(chatKey, chatId);
        window.location.href = `/chat/${chatId}`;
      }
    }
  };

  // Handle button click for admin/support
  const handleAdminClick = () => {
    window.location.href = "/admin/chats";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Welcome to the Chat Application
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Start chatting with your customers or support staff!
        </p>

        {loading || chatLoading ? (
          <div className="w-full py-3 text-center text-gray-500">
            Loading...
          </div>
        ) : user && user.role === "customer" ? (
          <button
            onClick={handleCreateChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Create Chat
          </button>
        ) : user && (user.role === "admin" || user.role === "support") ? (
          <button
            onClick={handleAdminClick}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            View All Queries
          </button>
        ) : null}

        {!loading && user && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Logged in as:{" "}
              <span className="font-bold">
                {user.role === "admin"
                  ? "Admin"
                  : user.role === "support"
                  ? "Support"
                  : "Customer"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
