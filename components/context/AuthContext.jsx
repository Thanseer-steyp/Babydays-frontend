"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch user from backend (cookie-based auth)
  const fetchUser = async () => {
    try {
      const res = await axiosPrivate.get("user/me/", {
        withCredentials: true, // 🔥 VERY IMPORTANT
      });

      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Run once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 After login success
  const login = async () => {
    await fetchUser(); // refresh user from backend
  };

  // 🔥 Logout
  const logout = async () => {
    try {
      await axiosPrivate.post("register/logout/", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);