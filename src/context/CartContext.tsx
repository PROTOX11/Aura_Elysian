import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartItems = response.data.products || [];
      setCart(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Optimistic update
      setCart(prevCart => {
        const itemIndex = prevCart.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
          if (quantity > 0) {
            const updatedCart = [...prevCart];
            updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity };
            return updatedCart;
          } else {
            return prevCart.filter(item => item.productId !== productId);
          }
        } else if (quantity > 0) {
          // Add new item to cart optimistically
          // Since we don't have full product info here, add with minimal info
          return [...prevCart, { productId, name: '', price: 0, image: '', quantity }];
        }
        return prevCart;
      });
      
      await axios.put(
        'http://localhost:5000/api/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refetch to ensure consistency, or rely on optimistic update
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      // Revert optimistic update on error if needed
      fetchCart();
    }
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, loading, updateCartItemQuantity, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
