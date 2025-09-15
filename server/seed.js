import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    image: String,
    category: String,
    rating: Number,
    reviews: Number,
});

const Product = mongoose.model("Product", productSchema);

const testimonialSchema = new mongoose.Schema({
    name: String,
    text: String,
    rating: Number,
    image: String,
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

const featuredCollectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
    color: String,
});
const FeaturedCollection = mongoose.model("FeaturedCollection", featuredCollectionSchema);

const products = [
  {
    name: 'Lavender Dreams Candle',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.pexels.com/photos/1134251/pexels-photo-1134251.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.8,
    reviews: 124,
  },
  {
    name: 'Rose candle',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1454435/pexels-photo-1454435.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.9,
    reviews: 89,
  },
  {
    name: 'Custom Flower Candle',
    price: 34.99,
    image: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Custom',
    rating: 5.0,
    reviews: 45,
  },
  {
    name: 'Sunset Amber Candle',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1268438/pexels-photo-1268438.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.7,
    reviews: 156,
  },
  {
    name: 'Pressed Flower candle',
    price: 26.99,
    image: 'https://images.pexels.com/photos/1445442/pexels-photo-1445442.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.6,
    reviews: 78,
  },
  {
    name: 'Vanilla Bean Candle',
    price: 22.99,
    image: 'https://images.pexels.com/photos/2526450/pexels-photo-2526450.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.8,
    reviews: 203,
  },
  {
    name: 'Botanical Ring',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Candles',
    rating: 4.5,
    reviews: 92,
  },
  {
    name: 'Personalized Photo Candle',
    price: 39.99,
    image: 'https://images.pexels.com/photos/5704786/pexels-photo-5704786.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Custom',
    rating: 4.9,
    reviews: 67,
  },
];

const testimonials = [
  {
    name: 'Aditya kumar',
    text: 'The custom candle exceeded my expectations! Beautiful craftsmanship and attention to detail.',
    rating: 5,
    image: 'https://res.cloudinary.com/dto6alw8f/image/upload/v1757605927/Screenshot_2025-09-11_211125_lzifkn.png',
  },
  {
    name: 'Ronit Srivastav',
    text: 'These candles smell absolutely divine and burn for hours. Perfect for creating a relaxing atmosphere.',
    rating: 5,
    image: 'https://res.cloudinary.com/dto6alw8f/image/upload/v1757606077/99ec95e6-9fe9-4338-9f8b-771e085a8928.png',
  },
  {
    name: 'Jiya Arya',
    text: 'I love how unique each piece is. The flower-embedded designs are truly works of art!',
    rating: 5,
    image: 'https://res.cloudinary.com/dto6alw8f/image/upload/v1757607039/WhatsApp_Image_2025-09-11_at_21.35.32_f3bae3c3_b9lae0.jpg',
  },
];

const featuredCollections = [
  {
    title: 'Artisan Candles',
    description: 'Hand-poured with natural wax and premium fragrances',
    image: 'https://images.pexels.com/photos/1134251/pexels-photo-1134251.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: '/candles',
    color: 'from-pink-400 to-rose-500'
  },

  {
    title: 'Custom Creations',
    description: 'Personalized designs crafted just for you',
    image: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: '/custom',
    color: 'from-amber-400 to-orange-500'
  }
];

const seedDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(products);

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(testimonials);

    await FeaturedCollection.deleteMany({});
    await FeaturedCollection.insertMany(featuredCollections);

    console.log('Database seeded!');
    mongoose.connection.close();
};

seedDB();
