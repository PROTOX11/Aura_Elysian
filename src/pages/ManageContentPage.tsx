import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Testimonial {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
}

interface FeaturedCollection {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
  type: string;
}

interface TrendingProduct {
  _id: string;
  name: string;
  price: number;
  primaryImage: string;
}

export const ManageContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'collections' | 'trending'>('testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);

  // Form states for adding new content
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    text: '',
    rating: 5,
    image: null as File | null,
  });

  const [newCollection, setNewCollection] = useState({
    title: '',
    description: '',
    image: null as File | null,
    link: '',
    color: '',
    type: 'theme',
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
      const [testRes, collRes, trendRes] = await Promise.all([
        axios.get('http://localhost:5000/api/testimonials'),
        axios.get('http://localhost:5000/api/featured-collections'),
        axios.get('http://localhost:5000/api/trending-products'),
      ]);
      setTestimonials(testRes.data);
      setCollections(collRes.data);
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

  const handleCollectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCollection(prev => ({ ...prev, [name]: value }));
  };

  const handleCollectionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCollection(prev => ({ ...prev, image: e.target.files![0] }));
    }
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

  const submitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to add collection');
      return;
    }
    const formData = new FormData();
    formData.append('title', newCollection.title);
    formData.append('description', newCollection.description);
    formData.append('link', newCollection.link);
    formData.append('color', newCollection.color);
    formData.append('type', newCollection.type);
    if (newCollection.image) {
      formData.append('image', newCollection.image);
    }
    try {
      await axios.post('http://localhost:5000/api/featured-collections', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Collection added successfully');
      setNewCollection({ title: '', description: '', image: null, link: '', color: '', type: 'theme' });
      fetchData();
    } catch (error) {
      console.error('Error adding collection:', error);
      alert('Failed to add collection');
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Content</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded ${activeTab === 'testimonials' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
        >
          Testimonials
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded ${activeTab === 'collections' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
        >
          Featured Collections
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 rounded ${activeTab === 'trending' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
        >
          Trending Products
        </button>
      </div>

      {activeTab === 'testimonials' && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {testimonials.map((t) => (
              <div key={t._id} className="border p-4 rounded">
                <p><strong>{t.name}</strong></p>
                <p>{t.text}</p>
                <p>Rating: {t.rating}</p>
                {t.image && <img src={`http://localhost:5000${t.image}`} alt={t.name} className="w-16 h-16 rounded-full" />}
              </div>
            ))}
          </div>
          <form onSubmit={submitTestimonial} className="space-y-4 max-w-md">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newTestimonial.name}
              onChange={handleTestimonialChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              name="text"
              placeholder="Testimonial text"
              value={newTestimonial.text}
              onChange={handleTestimonialChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              value={newTestimonial.rating}
              onChange={e => setNewTestimonial(prev => ({ ...prev, rating: Number(e.target.value) }))}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleTestimonialImageChange}
              className="w-full"
            />
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Add Testimonial</button>
          </form>
        </div>
      )}

      {activeTab === 'collections' && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Featured Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {collections.map((c) => (
              <div key={c._id} className="border p-4 rounded">
                <p><strong>{c.title}</strong></p>
                <p>Type: <span className="capitalize">{c.type}</span></p>
                <p>{c.description}</p>
                <p>Link: {c.link}</p>
                <p>Color: {c.color}</p>
                {c.image && <img src={`http://localhost:5000${c.image}`} alt={c.title} className="w-32 h-32" />}
              </div>
            ))}
          </div>
          <form onSubmit={submitCollection} className="space-y-4 max-w-md">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newCollection.title}
              onChange={handleCollectionChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newCollection.description}
              onChange={handleCollectionChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="link"
              placeholder="Link"
              value={newCollection.link}
              onChange={handleCollectionChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <select
              name="type"
              value={newCollection.type}
              onChange={handleCollectionChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="theme">Theme Collection</option>
              <option value="festival">Festival Collection</option>
              <option value="fragrance">Fragrance Collection</option>
            </select>
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={newCollection.color}
              onChange={handleCollectionChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCollectionImageChange}
              className="w-full"
            />
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Add Collection</button>
          </form>
        </div>
      )}

      {activeTab === 'trending' && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Trending Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {trendingProducts.map((p) => (
              <div key={p._id} className="border p-4 rounded relative">
                <button
                  onClick={() => removeTrendingProduct(p._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  Remove
                </button>
                <p><strong>{p.name}</strong></p>
                <p>Price: ₹{p.price}</p>
                {p.primaryImage && <img src={`http://localhost:5000${p.primaryImage}`} alt={p.name} className="w-32 h-32" />}
              </div>
            ))}
          </div>
          <form onSubmit={submitTrendingProduct} className="space-y-4 max-w-md">
            <input
              type="text"
              name="productId"
              placeholder="Product ID (from products collection)"
              value={newTrendingProduct.productId || ''}
              onChange={handleTrendingProductChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Add Trending Product</button>
          </form>
        </div>
      )}
    </div>
  );
};
