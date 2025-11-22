import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('aura-token');
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (response.status === 200) {
        setOrders(response.data);
      } else if (response.status === 401) {
        setError('Unauthorized. Please login again.');
        setOrders([]);
      } else {
        setError('Failed to fetch orders.');
        setOrders([]);
      }
    } catch (err) {
      setError('Network error. Please try later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Order History</h1>
        
        {loading && <p>Loading your orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && orders.length === 0 && <p>You have no past orders.</p>}

        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Order ID: {order._id}</span>
              <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-gray-500">Ordered On: {new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="mb-4">
              {order.products.map(product => (
                <div key={product.productId} className="flex justify-between border-b border-gray-200 py-2">
                  <span>{product.name}</span>
                  <span>{product.quantity} × ₹{product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="text-right font-semibold text-lg">Total: ₹{order.totalAmount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
