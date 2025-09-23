import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useFilters, useProductFilters } from '../hooks/useFilters';

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
  theme?: string;
}

export const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity } = useCart();
  const { filterOptions, filterState, updateFilterState, resetFilters, loading: filterLoading } = useFilters();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isCandlesPage = location.pathname === '/candles';

  const handleCartUpdate = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        const products = res.data;

        console.log('Fetched products:', products);

        setAllProducts(products.map((p: any) => ({
          ...p,
          id: p._id,
        })));

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on current filter state
  const { filteredProducts } = useProductFilters(allProducts);

  // Sort products
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handlePriceRangeChange = (value: number) => {
    updateFilterState({
      priceRange: [filterState.priceRange[0], value]
    });
  };

  const handleFestivalChange = (festival: string, checked: boolean) => {
    const newFestivals = checked
      ? [...filterState.selectedFestivals, festival]
      : filterState.selectedFestivals.filter(f => f !== festival);
    updateFilterState({ selectedFestivals: newFestivals });
  };

  const handleFragranceChange = (fragrance: string, checked: boolean) => {
    const newFragrances = checked
      ? [...filterState.selectedFragrances, fragrance]
      : filterState.selectedFragrances.filter(f => f !== fragrance);
    updateFilterState({ selectedFragrances: newFragrances });
  };

  const handleThemeChange = (theme: string, checked: boolean) => {
    const newThemes = checked
      ? [...filterState.selectedThemes, theme]
      : filterState.selectedThemes.filter(t => t !== theme);
    updateFilterState({ selectedThemes: newThemes });
  };

  const handleWeightChange = (weight: string, checked: boolean) => {
    const newWeights = checked
      ? [...filterState.selectedWeights, weight]
      : filterState.selectedWeights.filter(w => w !== weight);
    updateFilterState({ selectedWeights: newWeights });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filterState.selectedCategories, category]
      : filterState.selectedCategories.filter(c => c !== category);
    updateFilterState({ selectedCategories: newCategories });
  };

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
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-lg">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹{filterState.priceRange[0]}</span>
                    <span>₹{filterState.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={filterOptions?.priceRanges.min || 0}
                    max={filterOptions?.priceRanges.max || 1000}
                    value={filterState.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Festivals */}
              {filterOptions?.festivals && filterOptions.festivals.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">By Occasion</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.festivals.map(festival => (
                      <label key={festival} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filterState.selectedFestivals.includes(festival)}
                          onChange={e => handleFestivalChange(festival, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{festival}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Fragrances */}
              {filterOptions?.fragrances && filterOptions.fragrances.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">By Fragrance</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.fragrances.map(fragrance => (
                      <label key={fragrance} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filterState.selectedFragrances.includes(fragrance)}
                          onChange={e => handleFragranceChange(fragrance, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{fragrance}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes */}
              {filterOptions?.themes && filterOptions.themes.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">By Theme</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.themes.map(theme => (
                      <label key={theme} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filterState.selectedThemes.includes(theme)}
                          onChange={e => handleThemeChange(theme, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{theme}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Weights */}
              {filterOptions?.weights && filterOptions.weights.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">By Weight</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.weights.map(weight => (
                      <label key={weight} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filterState.selectedWeights.includes(weight)}
                          onChange={e => handleWeightChange(weight, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{weight}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {filterOptions?.categories && filterOptions.categories.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">By Category</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.categories.map(category => (
                      <label key={category} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={filterState.selectedCategories.includes(category)}
                          onChange={e => handleCategoryChange(category, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                    {filterLoading && <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />}
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
              className={`grid max-w-max mx-auto gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
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
                  className="text-center py-16 col-span-full"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
