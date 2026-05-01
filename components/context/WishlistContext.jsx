"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // ── Fetch Wishlist (only on login) ───────────────────────────────
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

  // ── Add to Wishlist (Optimistic) ────────────────────────────────
  const addToWishlist = async (product) => {
    // prevent duplicate
    if (wishlistIds.has(product.id)) return;

    // ✅ instant UI update
    setWishlistItems((prev) => [...prev, product]);
    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(product.id);
      return newSet;
    });

    try {
      await axiosPrivate.post(`user/wishlist/add/${product.slug}/`);
    } catch (err) {
      console.error("Add wishlist error:", err);

      // ❌ rollback
      setWishlistItems((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // ── Remove from Wishlist (Optimistic) ───────────────────────────
  const removeFromWishlist = async (product) => {
    // ✅ instant UI update
    setWishlistItems((prev) =>
      prev.filter((p) => p.id !== product.id)
    );

    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });

    try {
      await axiosPrivate.delete(
        `user/wishlist/remove/${product.slug}/`
      );
    } catch (err) {
      console.error("Remove wishlist error:", err);

      // ❌ rollback
      setWishlistItems((prev) => [...prev, product]);
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(product.id);
        return newSet;
      });
    }
  };

  // ── Check if wishlisted ─────────────────────────────────────────
  const isWishlisted = (id) => wishlistIds.has(id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistIds,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);