"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      const res = await axiosPrivate.get("user/wishlist/");
      setWishlistItems(res.data);
      setWishlistIds(new Set(res.data.map((p) => p.id)));
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (slug) => {
    try {
      await axiosPrivate.post(`user/wishlist/add/${slug}/`);
      await fetchWishlist();
    } catch (err) {
      console.error("Add wishlist error:", err);
    }
  };

  const removeFromWishlist = async (slug) => {
    try {
      await axiosPrivate.delete(`user/wishlist/remove/${slug}/`);
      await fetchWishlist();
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  const isWishlisted = (id) => wishlistIds.has(id);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistIds, fetchWishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);




