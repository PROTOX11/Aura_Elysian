import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  primaryImage: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  getCartCount: () => number;
  clearCart: () => void;
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
  const location = useLocation();

  const fetchCart = async () => {
    // Don't fetch cart for team pages
    if (location.pathname.startsWith('/team')) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('aura-token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true, // Don't throw for any status
      });
      
      if (response.status === 200) {
        const cartItems = response.data.products || [];
        setCart(cartItems);
      } else if (response.status === 401) {
        // Token invalid or expired, clear cart silently
        setCart([]);
        // Optionally clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('aura-token');
      } else {
        console.error('Error fetching cart:', response.status);
        setCart([]);
      }
    } catch (error: any) {
      console.error('Network error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [location.pathname]);

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('token') || localStorage.getItem('aura-token');
    if (!token) return;

    try {
      // Optimistic update
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.productId === productId);
        if (itemIndex > -1) {
          if (quantity > 0) {
            const updatedCart = [...prevCart];
            updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity };
            return updatedCart;
          } else {
            return prevCart.filter((item) => item.productId !== productId);
          }
        } else if (quantity > 0) {
          // Add new item to cart optimistically
          // Since we don't have full product info here, add with minimal info
          return [...prevCart, { productId, name: '', price: 0, primaryImage: '', quantity }];
        }
        return prevCart;
      });

      const response = await axios.put(
        '/api/cart',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: () => true,
        }
      );
      if (response.status === 200) {
        // Refetch to ensure consistency, or rely on optimistic update
        fetchCart();
      } else if (response.status === 401) {
        // Token invalid, revert silently
        fetchCart();
      } else {
        console.error('Error updating cart:', response.status);
        // Revert optimistic update on error if needed
        fetchCart();
      }
    } catch (error: any) {
      console.error('Network error updating cart:', error);
      // Revert optimistic update on error if needed
      fetchCart();
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('aura-token');
    if (!token) return;
    try {
      setCart([]);
      // Delete all items in user's cart on backend
      // Assuming API to clear cart is PUT /api/cart with each product quantity=0
      // Need to get current cart items and send quantity=0 for each
      const deleteRequests = cart.map(item =>
        axios.put(
          '/api/cart',
          { productId: item.productId, quantity: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(deleteRequests);
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      fetchCart();
    }
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, loading, updateCartItemQuantity, getCartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
