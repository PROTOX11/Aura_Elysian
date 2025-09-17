import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, CreditCard } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  theme?: string;
  fragrance?: string;
  weight?: string;
  container?: string;
  festival?: string[];
  description?: string;
}

const CandleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', 
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
      setIsInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (isInCart) {
      navigate('/cart');
    } else {
      // Logic for buy now
      alert('Proceeding to checkout!');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const checkCart = async () => {
      const token = localStorage.getItem('token');
      if (token && id) {
        try {
          const res = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const productIds = res.data.flatMap((cart: any) =>
            cart.products.map((p: any) => p.productId)
          );
          if (productIds.includes(id)) {
            setIsInCart(true);
          }
        } catch (error) {
          console.error('Error checking cart:', error);
        }
      }
    };

    if (product) {
      checkCart();
    }
  }, [product, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-pink-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    {discount}% OFF
                  </div>
                )}
              </div>
              {/* Thumbnails placeholder */}
              <div className="mt-4 grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded-lg ${i === 0 ? 'ring-2 ring-pink-500' : ''} overflow-hidden`}>
                     <img
                        src={`http://localhost:5000${product.image}`}
                        alt={`${product.name} thumbnail ${i+1}`}
                        className="w-full h-full object-cover"
                      />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 uppercase tracking-wider">{product.category}</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-600">
                    {(product.rating ?? 0).toFixed(1)} ({product.reviews ?? 0} reviews)
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-600 font-semibold">Inclusive of all taxes</p>
                </div>

                {product.description && (
                  <div className="mb-8">
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Product Specs */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                  {product.fragrance && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Fragrance:</span> <span className="text-gray-600">{product.fragrance}</span></div>}
                  {product.weight && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Weight:</span> <span className="text-gray-600">{product.weight}</span></div>}
                  {product.container && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Container:</span> <span className="text-gray-600">{product.container}</span></div>}
                  {product.theme && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Theme:</span> <span className="text-gray-600">{product.theme}</span></div>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart} 
                    disabled={isInCart}
                    className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-600 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} />
                    {isInCart ? '+1 Added' : 'Add to Cart'}
                  </button>
                  <button onClick={handleBuyNow} className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                    <CreditCard size={20} />
                    {isInCart ? 'Go to Cart' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section Placeholder */}
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center text-gray-500">
                    <p>No reviews yet.</p>
                    <p>Be the first to review this product!</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CandleDetailsPage;
