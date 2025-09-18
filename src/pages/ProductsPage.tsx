import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  primaryImage: string;
  category: string;
  rating: number;
  reviews: number;
  festival?: string[];
  fragrance?: string;
  weight?: string;
}

export const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);

  // Custom Order State
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [customReferenceLink, setCustomReferenceLink] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const isCandlesPage = location.pathname === '/candles';

  const handleCartUpdate = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const products = res.data;
        console.log('Fetched products:', products);

        if (products.length > 0) {
          const maxProductPrice = Math.ceil(Math.max(...products.map((p: Product) => p.price)));
          setMaxPrice(maxProductPrice);
          setPriceRange([0, maxProductPrice]);
        }

        setAllProducts(products.map((p: any) => {
          const primaryImageUrl = p.primaryImage && p.primaryImage.startsWith('http') ? p.primaryImage : `http://localhost:5000${p.primaryImage}`;
          console.log(`Product ${p._id} primaryImage URL:`, primaryImageUrl);
          return {
            ...p,
            id: p._id,
            primaryImage: primaryImageUrl,
          };
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);


  
  const categories = ['All', 'Candle', 'Custom'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = isCandlesPage ? product.category.toLowerCase() === 'candle' : true;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const festivalMatch = selectedFestivals.length === 0 || (product.festival && product.festival.some(f => selectedFestivals.includes(f)));
    const fragranceMatch = selectedFragrances.length === 0 || (product.fragrance && selectedFragrances.includes(product.fragrance));
    return categoryMatch && priceMatch && festivalMatch && fragranceMatch;
  });


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {isCandlesPage ? 'Handcrafted Candles' : 'Our Collection'}
          </h1>
          <p className="text-lg text-gray-600">
            {isCandlesPage
              ? 'Discover our exquisite collection of handcrafted candles, made with love and the finest ingredients'
              : 'Discover our complete range of handcrafted candles, and custom pieces'
            }
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
            >
              <h2 className="font-semibold text-gray-900 text-lg">Filters</h2>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Festivals */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">By Occasion</h3>
                <div className="space-y-2">
                  {['Diwali', 'Holi', 'Valentine', 'Birthday', 'Anniversary', 'Christmas'].map(festival => (
                    <label key={festival} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={festival}
                        onChange={e => {
                          const { value, checked } = e.target;
                          setSelectedFestivals(prev =>
                            checked ? [...prev, value] : prev.filter(item => item !== value)
                          );
                        }}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600">{festival}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fragrance */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">By Fragrance</h3>
                <div className="space-y-2">
                  {['Sandalwood', 'Rose', 'Jasmine'].map(fragrance => (
                    <label key={fragrance} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={fragrance}
                        onChange={e => {
                          const { value, checked } = e.target;
                          setSelectedFragrances(prev =>
                            checked ? [...prev, value] : prev.filter(item => item !== value)
                          );
                        }}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600">{fragrance}</span>
                    </label>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-4 shadow-sm mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    {sortedProducts.length} products
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-pink-100 text-pink-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        viewMode === 'list'
                          ? 'bg-pink-100 text-pink-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
            <ProductCard
              product={product}
              onCartUpdate={handleCartUpdate}
              quantity={cart.find(item => item.productId === product.id)?.quantity || 0}
            />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </motion.div>
            )}
            </motion.div>

            {/* Empty State */}
            {false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </motion.div>
            )}

            {/* Debug: Show count of products */}
          </div>
        </div>
      </div>
    </div>
  );
};
