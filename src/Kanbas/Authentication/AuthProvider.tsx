import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as client from "./client";

export const useUserRole = () => {
  const [role, setRole] = useState("");
  const auth = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await auth.getRole();
      setRole(userRole);
    };
    fetchRole();
  }, [auth]);

  return role;
};

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
        setToken(data._id);
        localStorage.setItem("user", data._id);
        return;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const getRole = async () => {
    const data = await client.getUser(token);
    return data.role;
  }
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    navigate("/Kanbas/Login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getRole }}>
      {children}
    </AuthContext.Provider>
  );
};
