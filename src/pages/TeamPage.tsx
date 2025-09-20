import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddProductForm } from '../components/AddProductForm';
import { AddReviewsForm } from '../components/AddReviewsForm';
import { ManageContentPage } from './ManageContentPage';
import { useNavigate } from 'react-router-dom';

const OrderList = () => (
    <div className="p-2 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Customer Orders</h2>
        <p className="text-sm sm:text-base">Order list will go here...</p>
    </div>
);

export const TeamPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'addProduct' | 'addReviews' | 'orderList' | 'manageContent'>('addProduct');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('aura-token');
        navigate('/team/login');
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const getDirection = () => {
        if (activeTab === 'addProduct') return -1;
        if (activeTab === 'addReviews') return 0;
        if (activeTab === 'orderList') return 1;
        return 2;
    };

    const direction = getDirection();

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
            <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-4">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left">Team Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 min-w-[120px] sm:min-w-0"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="flex flex-col sm:flex-row border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('addProduct')}
                            className={`w-full sm:flex-1 p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold transition-colors relative ${activeTab === 'addProduct' ? 'text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Add Product
                            {activeTab === 'addProduct' && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    layoutId="activeTeamTab"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('addReviews')}
                            className={`w-full sm:flex-1 p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold transition-colors relative ${activeTab === 'addReviews' ? 'text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Add Reviews
                            {activeTab === 'addReviews' && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    layoutId="activeTeamTab"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('orderList')}
                            className={`w-full sm:flex-1 p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold transition-colors relative ${activeTab === 'orderList' ? 'text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Order List
                            {activeTab === 'orderList' && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    layoutId="activeTeamTab"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('manageContent')}
                            className={`w-full sm:flex-1 p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold transition-colors relative ${activeTab === 'manageContent' ? 'text-pink-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Manage Content
                            {activeTab === 'manageContent' && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                                    layoutId="activeTeamTab"
                                />
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="relative">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={activeTab}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 200, damping: 20 }, // Adjusted for mobile performance
                                    opacity: { duration: 0.15 }, // Faster opacity transition
                                }}
                                className="w-full p-2 sm:p-4"
                            >
                                {activeTab === 'addProduct' && <AddProductForm />}
                                {activeTab === 'addReviews' && <AddReviewsForm />}
                                {activeTab === 'orderList' && <OrderList />}
                                {activeTab === 'manageContent' && <ManageContentPage />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
