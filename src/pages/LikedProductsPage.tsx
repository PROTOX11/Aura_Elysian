import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

export const LikedProductsPage: React.FC = () => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const liked = localStorage.getItem('likedProducts');
    if (liked) {
      setLikedProducts(JSON.parse(liked));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Liked Products</h1>
        {likedProducts.length === 0 ? (
          <p className="text-gray-600">You have not liked any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
