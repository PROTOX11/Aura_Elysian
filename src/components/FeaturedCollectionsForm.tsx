import React, { useState } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

interface FeaturedCollectionsFormProps {
  onSuccess?: () => void;
}

export const FeaturedCollectionsForm: React.FC<FeaturedCollectionsFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [type, setType] = useState<'theme' | 'festival' | 'fragrance'>('theme');
  const [loading, setLoading] = useState(false);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 4)); // Max 4 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || images.length === 0) {
      alert('Please provide title and at least one image');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('aura-token');
    if (!token) {
      alert('Please login to add collection');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', `${type} collection`);
      formData.append('link', '/products');
      formData.append('color', 'from-pink-500 to-purple-600');

      images.forEach((image, index) => {
        formData.append('image', image);
      });

      await axios.post('http://localhost:5000/api/featured-collections', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      alert('Collection added successfully');
      setTitle('');
      setImages([]);
      setType('theme');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding collection:', error);
      alert('Failed to add collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Add Featured Collection</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter collection title"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'theme' | 'festival' | 'fragrance')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="theme">Theme Collection</option>
            <option value="festival">Festival Collection</option>
            <option value="fragrance">Fragrance Collection</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Max 4)
          </label>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Image Button */}
          {images.length < 4 && (
            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-pink-300 transition-colors">
              <div className="text-center">
                <Plus className="mx-auto h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Add Images</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Collection'}
        </button>
      </form>
    </div>
  );
};
