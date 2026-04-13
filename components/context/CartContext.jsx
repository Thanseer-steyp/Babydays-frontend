"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosPrivate from "@/components/config/AxiosPrivate";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosPrivate.get("user/cart/");
      setCartItems(res.data);
      setCartCount(res.data.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (slug, variantId, quantity = 1) => {
    try {
      await axiosPrivate.post(`user/cart/add/${slug}/`, { variant_id: variantId, quantity });
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.response?.data };
    }
  };

  const removeFromCart = async (slug) => {
    try {
      await axiosPrivate.delete(`user/cart/remove/${slug}/`);
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const updateQty = async (slug, quantity) => {
    try {
      await axiosPrivate.patch(`user/cart/update/${slug}/`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, loading, fetchCart, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);






