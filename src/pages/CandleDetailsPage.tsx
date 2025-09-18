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

interface Review {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
  orderId: string;
  productId?: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}

const CandleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [rating, setRating] = useState(0);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleQuantityChange = async (newQuantity: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    newQuantity = Math.max(0, newQuantity);
    try {
      await axios.put('http://localhost:5000/api/cart',
        { productId: id, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (newQuantity > 0) {
        setIsInCart(true);
        setCartQuantity(newQuantity);
      } else {
        setIsInCart(false);
        setCartQuantity(0);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/cart',
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInCart(true);
      setCartQuantity(quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    navigate('/cart');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReviewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReview(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('productId', id!);
    formData.append('rating', rating.toString());
    formData.append('text', reviewText);  // Changed from 'review' to 'text' to match backend schema
    if (reviewImage) {
      formData.append('image', reviewImage);
    }

    try {
      await axios.post('http://localhost:5000/api/testimonials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Review submitted successfully!');
      setReviewText('');
      setReviewImage(null);
      setRating(0);
      // Refresh reviews
      const response = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setLoadingReview(false);
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
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    if (id) {
      fetchReviews();
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
          const products = res.data.products;
          const item = products.find((p: any) => p.productId === id);
          if (item) {
            setIsInCart(true);
            setCartQuantity(item.quantity);
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
                  src={`http://localhost:5000${product?.image}`}
                  alt={product?.name}
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
                        src={`http://localhost:5000${product?.image}`}
                        alt={`${product?.name} thumbnail ${i+1}`}
                        className="w-full h-full object-cover"
                      />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 uppercase tracking-wider">{product?.category}</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">{product?.name}</h1>

                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product?.rating ?? 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-600">
                    {(product?.rating ?? 0).toFixed(1)} ({product?.reviews ?? 0} reviews)
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">₹{product?.price}</span>
                    {product?.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-600 font-semibold">Inclusive of all taxes</p>
                </div>

                {product?.description && (
                  <div className="mb-8">
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Product Specs */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                  {product?.fragrance && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Fragrance:</span> <span className="text-gray-600">{product.fragrance}</span></div>}
                  {product?.weight && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Weight:</span> <span className="text-gray-600">{product.weight}</span></div>}
                  {product?.container && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Container:</span> <span className="text-gray-600">{product.container}</span></div>}
                  {product?.theme && <div className="p-3 bg-gray-50 rounded-lg"><span className="font-semibold text-gray-800">Theme:</span> <span className="text-gray-600">{product.theme}</span></div>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                {isInCart ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-center rounded-full bg-pink-100 text-pink-700 font-bold text-xs overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(cartQuantity - 1)}
                        className="p-2 hover:bg-pink-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4">{cartQuantity}</span>
                      <button
                        onClick={() => handleQuantityChange(cartQuantity + 1)}
                        className="p-2 hover:bg-pink-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!isInCart && (
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  )}
                  <button onClick={handleBuyNow} className={`w-full ${isInCart ? 'col-span-2' : ''} bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2`}>
                    <ShoppingCart size={20} />
                    Go to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No reviews yet.</p>
                <p>Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
{reviews.map((review) => (
  <div key={review._id} className="border border-gray-200 rounded-lg p-4">
    <div className="flex mb-2 items-center">
      <div className="mr-4 relative">
        <img
          src={`http://localhost:5000${review.userId?.image ? review.userId.image : '/default-profile.png'}`}
          alt={review.name}
          className="w-16 h-16 object-cover rounded-full"
        />
        <span className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center select-none">pp</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{review.name}</p>
        <div className="mt-1 flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mr-4 relative">
        <img
          src={`http://localhost:5000${review.image ? review.image : '/default-profile.png'}`}
          alt={review.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <span className="absolute top-0 left-0 bg-pink-600 text-white text-xs font-bold rounded w-6 h-6 flex items-center justify-center select-none">pi</span>
      </div>
    </div>
    <p className="text-gray-700">{review.text}</p>
  </div>
))}
              </div>
            )}

            {/* Add Review Form */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                    placeholder="Write your review here..."
                  />
                </div>
                <div>
                  <label htmlFor="reviewImage" className="block text-sm font-medium text-gray-700">
                    Upload Image (optional)
                  </label>
                  <input
                    type="file"
                    id="reviewImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                        aria-label={`${star} star`}
                      >
                        <svg
                          className="h-6 w-6 fill-current"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="inline-flex justify-center rounded-md border border-transparent bg-pink-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandleDetailsPage;
