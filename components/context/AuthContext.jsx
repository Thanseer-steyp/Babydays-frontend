"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchUser = async () => {
    try {
      const res = await axiosPrivate.get("user/me/", {
        withCredentials: true, 
      });

      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchUser();
  }, []);

  
  const login = async () => {
    await fetchUser(); 
  };

  
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