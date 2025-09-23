import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Sparkles, Gift, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

// Data Interfaces
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
}

interface Testimonial {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
}

interface FeaturedCollection {
  _id: string;
  name?: string;
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
  type: string;
}

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/trending-products');
        setFeaturedProducts(productsRes.data.map((p: { _id: string } & Product) => ({ ...p, id: p._id })));

        const testimonialsRes = await axios.get('http://localhost:5000/api/testimonials');
        setTestimonials(testimonialsRes.data);

        const collectionsRes = await axios.get('http://localhost:5000/api/featured-collections');
        setFeaturedCollections(collectionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCartUpdate = (productId: string, quantity: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  // Shuffle function to randomize array order
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Featured Collection Card Component with Image Carousel
  const FeaturedCollectionCard: React.FC<{ collection: FeaturedCollection }> = ({ collection }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Create multiple images array (using the same image for now, but ready for multiple images)
    const images = [collection.image, collection.image, collection.image]; // Placeholder for multiple images

    useEffect(() => {
      if (!isAutoPlaying || images.length <= 1) return;

      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }, [isAutoPlaying, images.length]);

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsAutoPlaying(false);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsAutoPlaying(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            key={currentImageIndex}
            src={`http://localhost:5000${images[currentImageIndex]}`}
            alt={collection.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h4 className="font-serif text-xl font-semibold mb-2">
            {collection.name || collection.title}
          </h4>

          <Link
            to={`${collection.link}?collection=${encodeURIComponent(collection.title)}`}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${collection.color} px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
          >
            Explore
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-pink-600 font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Transform your space with elegance
              <Sparkles className="h-4 w-4" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Luxury <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">Candles</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Discover our collection of exquisite, hand-poured candles—where elegant design meets captivating fragrance to create your perfect ambiance.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Collection
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/custom"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Gift className="h-5 w-5" />
                Custom Orders
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections of premium candles, and bespoke custom pieces.
            </p>
          </motion.div>

          {/* All Collections in Single Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shuffleArray(featuredCollections).map((collection) => (
              <FeaturedCollectionCard key={collection._id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trending Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular items, loved by customers worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard
                  product={product}
                  onLike={(id: string) => console.log('Liked product:', id)}
                  onCartUpdate={handleCartUpdate}
                  quantity={productQuantities[product.id] || 0}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy customers who have fallen in love with our products.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000${testimonial.image}`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to get special offers, new product launches, and exclusive content.
            </p>

            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
