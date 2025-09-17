import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';

interface CartItem {
    _id: string;
    userId: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
}

export const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(cartId);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/cart/${cartId}`, { quantity: newQuantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (cartId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/cart/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>
                {loading ? (
                    <p className="text-gray-600">Loading cart...</p>
                ) : cartItems.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
                            >
                                <img src={`http://localhost:5000${item.productId.image}`} alt={item.productId.name} className="w-20 h-20 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.productId.name}</h3>
                                    <p className="text-pink-600 font-medium">${item.productId.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item._id)}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
                                <button className="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-600">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
