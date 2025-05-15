import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const Logout = () => {
  const { logout } = UserData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          Are you sure you want to logout?
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
