// src/context/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu cart vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  };

  const clearCart = () => setCart([]);

  // 👉 Tính tổng số lượng và tổng tiền
  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
  const totalCost = cart.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
