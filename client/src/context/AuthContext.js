import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/auth/me");
          setUser(response.data.data);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password, role) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
