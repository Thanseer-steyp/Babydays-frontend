"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  // ── Fetch Wishlist (only on login) ───────────────────────────────
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
      const res = await axiosPrivate.get("user/wishlist/");

      setWishlistItems(res.data);
      setWishlistIds(new Set(res.data.map((p) => p.id)));
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