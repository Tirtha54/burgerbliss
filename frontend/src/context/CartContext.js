import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bb_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('bb_cart', JSON.stringify(newCart));
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id && !item.is_custom);
    if (existing && !item.is_custom) {
      saveCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      saveCart([...cart, { ...item, quantity: 1, cartId: Date.now() }]);
    }
  };

  const removeFromCart = (cartId) => {
    saveCart(cart.filter(c => c.cartId !== cartId));
  };

  const updateQty = (cartId, qty) => {
    if (qty < 1) { removeFromCart(cartId); return; }
    saveCart(cart.map(c => c.cartId === cartId ? { ...c, quantity: qty } : c));
  };

  const clearCart = () => saveCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
