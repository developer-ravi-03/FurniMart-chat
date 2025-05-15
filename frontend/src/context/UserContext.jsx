import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState(null);

  // Check for token and user data in localStorage on initial load
  // Set axios default headers for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuth(true);
      } catch (err) {
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

  // REGISTER user
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
        role,
      });

      const token = res.data.token;
      const userData = res.data.user;

      localStorage.setItem("token", token);
      setUser(userData);
      setIsAuth(true);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set token for axios after registration
      axios.defaults.headers.common["x-auth-token"] = token;

      toast.success("Registration successful!");
      navigate("/login");
      return { success: true };
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
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

  // LOGIN user
  const login = async ({ email, password }, navigate) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const userData = res.data.user;
      setUser(userData);
      setIsAuth(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Set token for axios after login
      axios.defaults.headers.common["x-auth-token"] = token;

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
    if (err.response) {
      if (err.response.data && err.response.data.message) {
        return err.response.data.message;
      }

      if (err.response.data && err.response.data.errors) {
        const errorsObj = err.response.data.errors;

        if (Array.isArray(errorsObj)) {
          return errorsObj[0]?.message || "Unknown error occurred";
        }

        const firstError = Object.values(errorsObj)[0];
        if (firstError) {
          return Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

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

    if (err.request && !err.response) {
      return "Network error. Please check your connection.";
    }

    return err.message || "An unexpected error occurred";
  };

  // LOGOUT user
  const logout = (navigate) => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    toast.success("Logged out");
    navigate("/login");
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
