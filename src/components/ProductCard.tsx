import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isLiked?: boolean;
}

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onAddToCart,
}) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {discount}% OFF
        </div>
      )}

      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onLike?.(product.id)}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
          product.isLiked
            ? 'bg-pink-500 text-white'
            : 'bg-white/80 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${product.isLiked ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => onAddToCart?.(product.id)}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Quick Add
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-serif text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart?.(product.id)}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-2.5 px-4 rounded-xl font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};