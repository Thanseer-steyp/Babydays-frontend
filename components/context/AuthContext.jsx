"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/components/config/AxiosInstance";
import { usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = async (token) => {
    try {
      const response = await axiosInstance.get("user/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { username, email } = response.data;
      setUser({ username, email });
    } catch (error) {
      console.error("Error fetching user info:", error.response || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      const remainingTime = decoded.exp * 1000 - Date.now();
      if (remainingTime <= 0) {
        logout();
        return;
      }
      const timer = setTimeout(logout, remainingTime);
      fetchUser(accessToken);
      return () => clearTimeout(timer);
    } catch {
      logout();
    }
  }, [accessToken]);

  useEffect(() => {
    const stored = localStorage.getItem("access");
    if (stored) setAccessToken(stored);
    else setLoading(false);
  }, []);

  const login = ({ access, refresh, username, email }) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setAccessToken(access);
    setUser({ username, email });
    if (!pathname.startsWith("/checkout")) {
      window.location.reload();
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("checkoutItems");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);





