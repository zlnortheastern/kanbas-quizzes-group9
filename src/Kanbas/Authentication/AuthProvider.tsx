import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import * as client from "./client";

const AuthContext = createContext(null as any);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null as any);
  const [token, setToken] = useState(localStorage.getItem("user") || "");
  const navigate = useNavigate();
  const login = async (userInput: any) => {
    try {
      const data = await client.authUser(userInput);
      if (data) {
        setUser(data);
        setToken(data[0]._id);
        localStorage.setItem("user", data[0]._id);
        return;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    navigate("/Kanbas/Login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
