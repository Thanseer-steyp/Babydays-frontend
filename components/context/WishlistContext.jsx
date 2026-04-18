"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";

const SLUGS_KEY = "wishlist_slugs";
const ITEMS_KEY = "wishlist_items";

const loadSlugs = () => {
  try {
    const raw = localStorage.getItem(SLUGS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
};

const loadItems = () => {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveSlugs = (slugSet) => {
  try { localStorage.setItem(SLUGS_KEY, JSON.stringify([...slugSet])); } catch {}
};

const saveItems = (items) => {
  try { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); } catch {}
};

const clearStorage = () => {
  try {
    localStorage.removeItem(SLUGS_KEY);
    localStorage.removeItem(ITEMS_KEY);
  } catch {}
};

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistSlugs, setWishlistSlugs] = useState(() => loadSlugs());
  const [wishlistItems, setWishlistItems] = useState(() => loadItems());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => { saveSlugs(wishlistSlugs); }, [wishlistSlugs]);

  
  useEffect(() => { saveItems(wishlistItems); }, [wishlistItems]);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosPrivate.get("user/wishlist/", { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      const slugSet = new Set(data.map((p) => p.slug));
      setWishlistSlugs(slugSet);
      setWishlistItems(data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setWishlistSlugs(new Set());
        setWishlistItems([]);
        clearStorage();
      } else if (err?.response?.status === 500) {
        console.warn("Wishlist fetch unavailable (server error)");
      } else {
        console.error("Wishlist fetch error:", err?.response?.status || "No Status", err?.response?.data || err.message);
        setError("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = async (slug, productData = null) => {
    setWishlistSlugs((prev) => {
      const updated = new Set([...prev, slug]);
      saveSlugs(updated);
      return updated;
    });
    if (productData) {
      setWishlistItems((prev) => {
        const exists = prev.find((p) => p.slug === slug);
        const updated = exists ? prev : [...prev, productData];
        saveItems(updated);
        return updated;
      });
    }
    try {
      await axiosPrivate.post(`user/wishlist/add/${slug}/`, {}, { withCredentials: true });
    } catch (err) {
      // Rollback
      setWishlistSlugs((prev) => {
        const updated = new Set(prev);
        updated.delete(slug);
        saveSlugs(updated);
        return updated;
      });
      setWishlistItems((prev) => {
        const updated = prev.filter((p) => p.slug !== slug);
        saveItems(updated);
        return updated;
      });
      console.error("Add wishlist error:", err?.response?.data || err.message);
    }
  };

  const removeFromWishlist = async (slug) => {
    setWishlistSlugs((prev) => {
      const updated = new Set(prev);
      updated.delete(slug);
      saveSlugs(updated);
      return updated;
    });
    setWishlistItems((prev) => {
      const updated = prev.filter((p) => p.slug !== slug);
      saveItems(updated);
      return updated;
    });
    try {
      await axiosPrivate.delete(`user/wishlist/remove/${slug}/`, { withCredentials: true });
    } catch (err) {
      console.error("Remove wishlist error:", err?.response?.data || err.message);
    }
  };

  const toggleWishlist = async (slug, productData = null) => {
    if (wishlistSlugs.has(slug)) {
      await removeFromWishlist(slug);
    } else {
      await addToWishlist(slug, productData);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistSlugs,
        wishlistItems,
        loading,
        error,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);