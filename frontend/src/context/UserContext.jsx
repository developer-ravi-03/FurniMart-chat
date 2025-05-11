import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuth(true);
    }
    setLoading(false);
  }, []);

  // REGISTER user
  const register = async ({ name, email, password }) => {
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const userData = res.data.user;
      setUser(userData);
      setIsAuth(true);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Registration successful!");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  // LOGIN user
  const login = async ({ email, password }, navigate) => {
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const userData = res.data.user;
      setUser(userData);
      setIsAuth(true);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful!");
      navigate("/");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  // LOGOUT user
  const logout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth,
        register,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
