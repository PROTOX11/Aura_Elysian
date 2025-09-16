import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Mail, User as UserIcon, MapPin, Phone, Package } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    username?: string;
    mobile?: string;
    address?: string;
  } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('aura-token');
    if (!token) {
      navigate('/login');
      return;
    }

    // For now, decode token to get user info (assuming JWT payload has name and email)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        name: payload.name || 'User',
        email: payload.email,
        username: payload.username || payload.name?.toLowerCase().replace(' ', '_') || 'user',
        mobile: payload.mobile || '+1 (555) 123-4567',
        address: payload.address || '123 Main St, City, State 12345'
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      // Fallback: could fetch from API if needed
      setUser({
        name: 'User',
        email: 'user@example.com',
        username: 'user',
        mobile: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      });
    }

    // Mock orders data - in real app, fetch from API
    setOrders([
      { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 89.99, items: 2 },
      { id: 'ORD-002', date: '2024-01-10', status: 'Shipped', total: 45.50, items: 1 },
      { id: 'ORD-003', date: '2024-01-05', status: 'Processing', total: 120.00, items: 3 },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('aura-token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <User className="h-6 w-6 text-pink-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">Full Name</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <UserIcon className="h-6 w-6 text-pink-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">Username</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 text-pink-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">Email Address</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-6 w-6 text-pink-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">{user.mobile}</p>
                <p className="text-sm text-gray-500">Mobile Number</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-6 w-6 text-pink-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">{user.address}</p>
                <p className="text-sm text-gray-500">Address</p>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-6 w-6 text-pink-500 mr-2" />
              Order History
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items} items</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
