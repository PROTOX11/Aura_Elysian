import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
    const { cart, loading, updateCartItemQuantity } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>
                {loading ? (
                    <p className="text-gray-600">Loading cart...</p>
                ) : cart.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
                            >
                                <img src={item.primaryImage} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-pink-600 font-medium">₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => updateCartItemQuantity(item.productId, 0)}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</span>
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
