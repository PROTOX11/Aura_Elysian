import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { upload, uploadSingleImage, uploadMultipleImages, deleteImage } from './services/uploadService.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Aura_Elysian');
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
connectDB();

// Define Schemas and Models
const auraUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const AuraUser = mongoose.model('AuraUser', auraUserSchema);

import User from './models/User.js';
import CustomOrder from './models/CustomOrder.js';
import Cart from './models/Cart.js';
import TrendingProduct from './models/TrendingProduct.js';

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    images: [String],
    primaryImage: String,
    category: String,
    rating: Number,
    reviews: Number,
    theme: String,
    fragrance: String,
    weight: String,
    container: String,
    festival: [String],
    description: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AuraUser' },
});
const Product = mongoose.model('Product', productSchema);

const testimonialSchema = new mongoose.Schema({
    name: String,
    text: String,
    rating: Number,
    image: String,
    orderId: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
});
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const productReviewSchema = new mongoose.Schema({
    name: String,
    text: String,
    rating: Number,
    image: String,
    images: [String],
    orderId: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const ProductReview = mongoose.model('ProductReview', productReviewSchema);

const featuredCollectionSchema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    image: String, // Keep for backward compatibility
    images: [String], // Array of image paths
    link: String,
    color: String,
    type: {
        type: String,
        enum: ['theme', 'festival', 'fragrance'],
        required: true
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AuraUser' },
});
const FeaturedCollection = mongoose.model('FeaturedCollection', featuredCollectionSchema);

import { auth } from './middleware/auth.js';
import userRoutes from './routes/user.js';
import uploadRoutes from './routes/upload.js';

// Routes
app.use('/api', userRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/products', async (req, res) => {
    const { limit } = req.query;
    let query = Product.find();
    if (limit) query = query.limit(parseInt(limit, 10));
    const products = await query;
    res.json(products);
});

// Dynamic Filter Options API
app.get('/api/filters', async (req, res) => {
    try {
        const products = await Product.find({}, 'fragrance festival theme weight price category');

        // Extract unique values for each filter
        const filters = {
            fragrances: [...new Set(products
                .map(p => p.fragrance)
                .filter(Boolean)
                .map(f => f.trim())
                .filter(f => f.length > 0)
            )].sort(),

            festivals: [...new Set(products
                .flatMap(p => p.festival || [])
                .filter(Boolean)
                .map(f => f.trim())
                .filter(f => f.length > 0)
            )].sort(),

            themes: [...new Set(products
                .map(p => p.theme)
                .filter(Boolean)
                .map(t => t.trim())
                .filter(t => t.length > 0)
            )].sort(),

            weights: [...new Set(products
                .map(p => p.weight)
                .filter(Boolean)
                .map(w => w.trim())
                .filter(w => w.length > 0)
            )].sort(),

            priceRanges: {
                min: products.length > 0 ? Math.min(...products.map(p => p.price || 0)) : 0,
                max: products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 1000
            },

            categories: [...new Set(products
                .map(p => p.category)
                .filter(Boolean)
                .map(c => c.trim())
                .filter(c => c.length > 0)
            )].sort()
        };

        res.json(filters);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ message: 'Failed to fetch filter options' });
    }
});

// Filter refresh endpoint (for cache invalidation)
app.post('/api/filters/refresh', auth, async (req, res) => {
    try {
        // This endpoint can be used to trigger filter refresh
        // In a production environment, you might want to implement caching here
        res.json({ message: 'Filter cache refreshed successfully' });
    } catch (error) {
        console.error('Error refreshing filters:', error);
        res.status(500).json({ message: 'Failed to refresh filters' });
    }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.id }).populate('userId', 'name email image');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', auth, upload.array('images', 5), async (req, res) => {
    console.log('Received authenticated request to add product:', req.body);
    try {
        let imageUrls = [];
        let primaryImage = '';

        if (req.files && req.files.length > 0) {
            // Upload images to Cloudinary
            const cloudinaryResults = await uploadMultipleImages(req.files, 'products');
            imageUrls = cloudinaryResults.map(result => result.secure_url);

            const primaryIndex = parseInt(req.body.primaryIndex) || 0;
            primaryImage = imageUrls[primaryIndex] || imageUrls[0] || '';
        }

        const productData = {
            ...req.body,
            images: imageUrls,
            primaryImage: primaryImage,
            uploadedBy: req.user.id,
            festival: req.body.festival ? JSON.parse(req.body.festival) : [],
        };
        const product = new Product(productData);
        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct);
        // Return only the _id field in response
        res.status(201).json({ id: savedProduct._id });
    } catch (error) {
        console.error('Error saving product:', error.stack || error);
        res.status(500).json({ message: 'Failed to save product' });
    }
});

// Custom Orders API
app.post('/api/custom-orders', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('req.user:', req.user);
        console.log('req.user.id:', req.user.id);

        let imageUrl = '';
        if (req.file) {
            // Upload image to Cloudinary
            const cloudinaryResult = await uploadSingleImage(req.file, 'custom-orders');
            imageUrl = cloudinaryResult.secure_url;
        }

        const customOrderData = {
            userId: req.user.id,
            image: imageUrl,
            description: req.body.description || '',
            referenceLink: req.body.referenceLink || '',
        };
        console.log('customOrderData:', customOrderData);
        const customOrder = new CustomOrder(customOrderData);
        const savedOrder = await customOrder.save();
        console.log('savedOrder:', savedOrder);
        res.status(201).json({ message: 'Custom order submitted successfully', id: savedOrder._id });
    } catch (error) {
        console.error('Error saving custom order:', error.stack || error);
        res.status(500).json({ message: 'Failed to submit custom order' });
    }
});

// Cart API
app.get('/api/cart', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.json({ products: [] });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

app.put('/api/cart', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart && quantity > 0) {
            // If no cart, create one
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            const newCart = await Cart.create({
                userId,
                products: [{
                    productId,
                    name: product.name,
                    price: product.price,
                    primaryImage: product.primaryImage,
                    quantity
                }],
            });
            return res.status(201).json(newCart);
        }

        if (cart) {
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                // Product exists in cart
                if (quantity > 0) {
                    cart.products[itemIndex].quantity = quantity;
                } else {
                    cart.products.splice(itemIndex, 1);
                }
            } else if (quantity > 0) {
                // Product not in cart, add it
                const product = await Product.findById(productId);
                if (!product) return res.status(404).json({ message: 'Product not found' });

                cart.products.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    primaryImage: product.primaryImage,
                    quantity
                });
            }
            // If itemIndex is -1 and quantity is 0, do nothing

            cart = await cart.save();
            return res.status(200).json(cart);
        }

        return res.status(400).json({ message: "Invalid request" });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).send('Something went wrong');
    }
});

app.get('/api/testimonials', async (req, res) => {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
});

app.post('/api/testimonials', auth, upload.single('image'), async (req, res) => {
    console.log('Received authenticated request to add testimonial:', req.body);
    try {
        let imageUrl = '';
        if (req.file) {
            // Upload image to Cloudinary
            const cloudinaryResult = await uploadSingleImage(req.file, 'testimonials');
            imageUrl = cloudinaryResult.secure_url;
        }

        const testimonialData = {
            ...req.body,
            image: imageUrl,
        };

        const testimonial = new Testimonial(testimonialData);
        const savedItem = await testimonial.save();
        console.log('Testimonial saved successfully:', savedItem);

        res.status(201).json({ message: 'Testimonial added successfully' });
    } catch (error) {
        console.error('Error saving testimonial:', error.stack || error);
        res.status(500).json({ message: 'Failed to save testimonial' });
    }
});

app.delete('/api/testimonials/:id', auth, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ message: 'Failed to delete testimonial' });
    }
});

app.post('/api/productreviews', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 3 }]), async (req, res) => {
    console.log('Received authenticated request to add product review:', req.body);
    try {
        // Check if user is normal user or aura user
        let userName = req.body.name;
        let userId = null;

        const normalUser = await User.findById(req.user.id);
        if (normalUser) {
            userName = normalUser.name;
            userId = req.user.id;
        } else {
            // Assume aura user, use name from form
            userName = req.body.name;
        }

        let profileImagePath = '';
        let productImagePaths = [];

        // Upload profile image to Cloudinary
        if (req.files.image && req.files.image[0]) {
            const cloudinaryResult = await uploadSingleImage(req.files.image[0], 'reviews');
            profileImagePath = cloudinaryResult.secure_url;
        }

        // Upload product images to Cloudinary
        if (req.files.images && req.files.images.length > 0) {
            const cloudinaryResults = await uploadMultipleImages(req.files.images, 'reviews');
            productImagePaths = cloudinaryResults.map(result => result.secure_url);
        }

        const reviewData = {
            ...req.body,
            name: userName,
            image: profileImagePath,
            images: productImagePaths,
            userId: userId,
        };

        const productReview = new ProductReview(reviewData);
        const savedItem = await productReview.save();
        console.log('Product review saved successfully:', savedItem);

        // Increment product reviews count and update average rating
        const productId = savedItem.productId;
        if (productId) {
            const product = await Product.findById(productId);
            if (product) {
                const previousReviews = typeof product.reviews === 'number' ? product.reviews : 0;
                const previousRating = typeof product.rating === 'number' ? product.rating : 0;
                const incomingRating = typeof reviewData.rating !== 'undefined' ? Number(reviewData.rating) : NaN;
                const newReviews = previousReviews + 1;
                const newAvgRating = !isNaN(incomingRating)
                    ? ((previousRating * previousReviews) + incomingRating) / newReviews
                    : previousRating;

                await Product.findByIdAndUpdate(productId, {
                    $inc: { reviews: 1 },
                    $set: { rating: newAvgRating }
                });

                // Keep TrendingProduct in sync if it exists
                await TrendingProduct.updateMany({ productId }, {
                    $inc: { reviews: 1 },
                    $set: { rating: newAvgRating }
                });
            }
        }

        res.status(201).json({ message: 'Product review added successfully' });
    } catch (error) {
        console.error('Error saving product review:', error.stack || error);
        res.status(500).json({ message: 'Failed to save product review' });
    }
});

app.get('/api/featured-collections', async (req, res) => {
    const collections = await FeaturedCollection.find();
    res.json(collections);
});

// Debug endpoint to check token validity
app.get('/api/auth/verify', auth, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: { id: req.user.id, email: req.user.email }
    });
});

app.post('/api/featured-collections', auth, upload.array('image', 4), async (req, res) => {
    console.log('Received authenticated request to add featured collection:', req.body);
    console.log('User from auth middleware:', req.user);
    console.log('Files received:', req.files ? req.files.length : 0);

    try {
        let imageUrls = [];
        let primaryImage = '';

        if (req.files && req.files.length > 0) {
            // Upload images to Cloudinary
            const cloudinaryResults = await uploadMultipleImages(req.files, 'collections');
            imageUrls = cloudinaryResults.map(result => result.secure_url);
            primaryImage = imageUrls[0] || '';
        }

        const collectionData = {
            ...req.body,
            image: primaryImage, // Keep for backward compatibility
            images: imageUrls, // Store all images
            uploadedBy: req.user.id,
        };

        console.log('Collection data to save:', collectionData);

        const collection = new FeaturedCollection(collectionData);
        const savedItem = await collection.save();
        console.log('Featured collection saved successfully:', savedItem);

        res.status(201).json({ message: 'Featured collection added successfully' });
    } catch (error) {
        console.error('Error saving featured collection:', error.stack || error);
        res.status(500).json({ message: 'Failed to save featured collection' });
    }
});

app.get('/api/trending-products', async (req, res) => {
    try {
        const trendingProducts = await TrendingProduct.find().populate('productId');
        // Transform the data to include product details
        const transformedProducts = trendingProducts.map(tp => {
            if (tp.productId) {
                // If productId exists, use product data
                return {
                    _id: tp._id,
                    name: tp.productId.name,
                    price: tp.productId.price,
                    originalPrice: tp.productId.originalPrice,
                    primaryImage: tp.productId.primaryImage,
                    images: tp.productId.images,
                    category: tp.productId.category,
                    rating: tp.productId.rating,
                    reviews: tp.productId.reviews,
                    theme: tp.productId.theme,
                    fragrance: tp.productId.fragrance,
                    weight: tp.productId.weight,
                    container: tp.productId.container,
                    festival: tp.productId.festival,
                    description: tp.productId.description,
                    productId: tp.productId._id,
                };
            } else {
                // If no productId, use trending product data
                return {
                    _id: tp._id,
                    name: tp.name,
                    price: tp.price,
                    originalPrice: tp.originalPrice,
                    primaryImage: tp.primaryImage,
                    images: tp.images,
                    category: tp.category,
                    rating: tp.rating,
                    reviews: tp.reviews,
                    theme: tp.theme,
                    fragrance: tp.fragrance,
                    weight: tp.weight,
                    container: tp.container,
                    festival: tp.festival,
                    description: tp.description,
                };
            }
        });
        res.json(transformedProducts);
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ message: 'Failed to fetch trending products' });
    }
});

app.post('/api/trending-products', auth, upload.array('images', 5), async (req, res) => {
    console.log('Received authenticated request to add trending product:', req.body);
    try {
        const trendingProductData = {
            productId: req.body.productId,
            uploadedBy: req.user.id,
        };
        const trendingProduct = new TrendingProduct(trendingProductData);
        const savedProduct = await trendingProduct.save();
        console.log('Trending product saved successfully:', savedProduct);
        res.status(201).json({ id: savedProduct._id });
    } catch (error) {
        console.error('Error saving trending product:', error.stack || error);
        res.status(500).json({ message: 'Failed to save trending product' });
    }
});

app.delete('/api/trending-products/:id', auth, async (req, res) => {
    try {
        const trendingProduct = await TrendingProduct.findById(req.params.id);
        if (!trendingProduct) {
            return res.status(404).json({ message: 'Trending product not found' });
        }
        // Check if user is the one who uploaded it or is an admin
        if (trendingProduct.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this trending product' });
        }
        await TrendingProduct.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trending product removed successfully' });
    } catch (error) {
        console.error('Error deleting trending product:', error);
        res.status(500).json({ message: 'Failed to delete trending product' });
    }
});

app.post('/api/team/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received signup request:', req.body);
    try {
        const existingUser = await AuraUser.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await AuraUser.create({ name, email, password: hashedPassword });
        console.log('User created:', result);
        res.status(201).json({ result });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/api/team/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await AuraUser.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET || 'test', { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// General User Routes
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        // Store password as plain text (insecure)
        const result = await User.create({ name, email, password });
        res.status(201).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        console.log('Login attempt:', { email, password });
        if (!existingUser) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: "User doesn't exist" });
        }
        console.log('Stored password:', existingUser.password);
        // Compare plain text passwords (insecure)
        if (password !== existingUser.password) {
            console.log('Password mismatch:', { received: password, stored: existingUser.password });
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET || 'test', { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
