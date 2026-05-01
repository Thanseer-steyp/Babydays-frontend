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

  const addToCart = async (slug, variant_id) => {
    try {
      await axiosPrivate.post(`user/cart/add/${slug}/`, { variant_id });
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err?.response?.data };
    }
  };

  const removeFromCart = async (slug, variant_id) => {
    try {
      await axiosPrivate.delete(`user/cart/remove/${slug}/`, {
        data: { variant_id },
      });
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const updateQty = async (slug, variant_id, newQty, currentQty) => {
    const action = newQty > currentQty ? "increase" : "decrease";

    try {
      await axiosPrivate.patch(`user/cart/update/${slug}/`, {
        action,
        variant_id,
      });

      // ✅ update UI instantly (NO refetch)
      setCartItems((prev) =>
        prev.map((item) =>
          item.variant_id === variant_id ? { ...item, quantity: newQty } : item,
        ),
      );

      setCartCount((prev) => (action === "increase" ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
