import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star, Upload, User, MessageSquare, Trash2 } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
}



interface TrendingProduct {
  _id: string;
  name: string;
  price: number;
  primaryImage: string;
}

export const ManageContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'trending'>('testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);

  // Form states for adding new content
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    text: '',
    rating: 5,
    image: null as File | null,
  });



  const [newTrendingProduct, setNewTrendingProduct] = useState({
    productId: '',
    images: [] as File[],
    festival: '',
    description: '',
    category: '',
    fragrance: '',
    weight: '',
    container: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testRes, trendRes] = await Promise.all([
        axios.get('http://localhost:5000/api/testimonials'),
        axios.get('http://localhost:5000/api/trending-products'),
      ]);
      setTestimonials(testRes.data);
      setTrendingProducts(trendRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handlers for form inputs
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleTestimonialImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTestimonial(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewTestimonial(prev => ({ ...prev, rating }));
  };



  const handleTrendingProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTrendingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleTrendingProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewTrendingProduct(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray].slice(0, 5), // max 5 images
      }));
    }
  };

  // Submit handlers
  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to add testimonial');
      return;
    }
    const formData = new FormData();
    formData.append('name', newTestimonial.name);
    formData.append('text', newTestimonial.text);
    formData.append('rating', newTestimonial.rating.toString());
    if (newTestimonial.image) {
      formData.append('image', newTestimonial.image);
    }
    try {
      await axios.post('http://localhost:5000/api/testimonials', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Testimonial added successfully');
      setNewTestimonial({ name: '', text: '', rating: 5, image: null });
      fetchData();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Failed to add testimonial');
    }
  };

  const deleteTestimonial = async (id: string) => {
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to delete testimonial');
      return;
    }
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Testimonial deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };



  const submitTrendingProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to add trending product');
      return;
    }
    const formData = new FormData();
    formData.append('productId', newTrendingProduct.productId);
    try {
      await axios.post('http://localhost:5000/api/trending-products', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Trending product added successfully');
      setNewTrendingProduct({
        productId: '',
        images: [],
        festival: '',
        description: '',
        category: '',
        fragrance: '',
        weight: '',
        container: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error adding trending product:', error);
      alert('Failed to add trending product');
    }
  };

  const removeTrendingProduct = async (id: string) => {
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to remove trending product');
      return;
    }
    if (!confirm('Are you sure you want to remove this trending product?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/trending-products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Trending product removed successfully');
      fetchData();
    } catch (error) {
      console.error('Error removing trending product:', error);
      alert('Failed to remove trending product');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Manage Content</h2>

        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 rounded-md font-semibold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Testimonials
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 rounded-md font-semibold transition-all ${
              activeTab === 'trending'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trending Products
          </button>
        </div>

        {activeTab === 'testimonials' && (
          <div className="space-y-8">
            {/* Add New Testimonial Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-pink-600" />
                Add New Testimonial
              </h3>

              <form onSubmit={submitTestimonial} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Picture
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTestimonialImageChange}
                        className="hidden"
                        id="testimonial-image"
                      />
                      <label htmlFor="testimonial-image" className="cursor-pointer">
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">
                            {newTestimonial.image ? newTestimonial.image.name : 'Click to upload profile picture'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter customer name"
                      value={newTestimonial.name}
                      onChange={handleTestimonialChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Review Text
                  </label>
                  <textarea
                    name="text"
                    placeholder="Write the customer testimonial..."
                    value={newTestimonial.text}
                    onChange={handleTestimonialChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                  />
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= newTestimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-gray-600 self-center">
                      {newTestimonial.rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Add Testimonial
                  </button>
                </div>
              </form>
            </div>

            {/* Display Testimonials */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-pink-600" />
                Customer Testimonials ({testimonials.length})
              </h3>

              {testimonials.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No testimonials yet</p>
                  <p className="text-gray-400 text-sm">Add your first testimonial above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <motion.div
                      key={testimonial._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`http://localhost:5000${testimonial.image}`}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTestimonial(testimonial._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                          title="Delete testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}



        {activeTab === 'trending' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Manage Trending Products</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {trendingProducts.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 relative">
                    <button
                      onClick={() => removeTrendingProduct(product._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                    <div className="flex gap-4">
                      {product.primaryImage && (
                        <img
                          src={`http://localhost:5000${product.primaryImage}`}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-gray-600">₹{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={submitTrendingProduct} className="space-y-4 max-w-md">
                <input
                  type="text"
                  name="productId"
                  placeholder="Product ID (from products collection)"
                  value={newTrendingProduct.productId || ''}
                  onChange={(e) => setNewTrendingProduct(prev => ({ ...prev, productId: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700"
                >
                  Add Trending Product
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
