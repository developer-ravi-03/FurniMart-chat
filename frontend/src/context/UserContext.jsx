/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuth(true);
      } catch (err) {
        // Handle invalid JSON in localStorage
        localStorage.removeItem("user");
        console.error("Invalid user data in localStorage:", err);
      }
    }
    setLoading(false);
  }, []);

  // Clear error after showing toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  // REGISTER user with improved error handling
  // Updated register function that aligns with the User model and register route
  const register = async ({
    name,
    email,
    password,
    role = "customer",
    navigate,
  }) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role, // Include role from the User model enum
      });

      // Handle the response based on the actual API response structure
      // Your register route returns { token, user: { id, name, email, role } }
      const token = res.data.token;
      const userData = res.data.user;

      // Save token
      localStorage.setItem("token", token);

      // Save user data
      setUser(userData);
      setIsAuth(true);
      localStorage.setItem("user", JSON.stringify(userData));

      // Configure axios to use the token for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Registration successful!");
      navigate("/login");
      return { success: true };
    } catch (err) {
      // Enhanced error handling specific to registration errors
      const errorMessage = extractErrorMessage(err);

      // Handle specific registration errors from the route
      if (
        err.response?.status === 400 &&
        err.response?.data?.msg === "User already exists"
      ) {
        const message = "An account with this email already exists";
        setError(message);
        toast.error(message);
        return { success: false, message };
      }

      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN user with improved error handling
  const login = async ({ email, password }, navigate) => {
    try {
      setLoading(true);
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
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Extract meaningful error messages from various error response formats
  const extractErrorMessage = (err) => {
    // Check for axios error response formats
    if (err.response) {
      // Direct error message from API
      if (err.response.data && err.response.data.message) {
        return err.response.data.message;
      }

      // Error object with multiple field errors
      if (err.response.data && err.response.data.errors) {
        const errorsObj = err.response.data.errors;

        // Handle array of error objects
        if (Array.isArray(errorsObj)) {
          return errorsObj[0]?.message || "Unknown error occurred";
        }

        // Handle object of field errors
        const firstError = Object.values(errorsObj)[0];
        if (firstError) {
          return Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

      // Status-based fallback messages
      if (err.response.status === 401) {
        return "Invalid email or password";
      }
      if (err.response.status === 404) {
        return "Service not found";
      }
      if (err.response.status === 500) {
        return "Server error, please try again later";
      }

      return `Error: ${err.response.status}`;
    }

    // Network errors
    if (err.request && !err.response) {
      return "Network error. Please check your connection.";
    }

    // Fallback for other error types
    return err.message || "An unexpected error occurred";
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
        error,
        register,
        login,
        logout,
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "rgb(59, 130, 246)",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
