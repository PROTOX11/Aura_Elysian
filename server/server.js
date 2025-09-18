import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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

// General User Schema
// Remove duplicate userSchema and User model definition here to avoid OverwriteModelError
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     username: { type: String },
//     mobile: { type: String },
//     address: { type: String },
// });
// const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    image: String,
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
    orderId: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const ProductReview = mongoose.model('ProductReview', productReviewSchema);

const featuredCollectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
    color: String,
});
const FeaturedCollection = mongoose.model('FeaturedCollection', featuredCollectionSchema);

import { auth } from './middleware/auth.js';
import userRoutes from './routes/user.js';

// Routes
app.use('/api', userRoutes);
app.get('/api/products', async (req, res) => {
    const { limit } = req.query;
    let query = Product.find();
    if (limit) query = query.limit(parseInt(limit, 10));
    const products = await query;
    res.json(products);
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

app.post('/api/products', auth, upload.single('image'), async (req, res) => {
    console.log('Received authenticated request to add product:', req.body);
    try {
        const productData = {
            ...req.body,
            image: req.file ? `/uploads/${req.file.filename}` : '',
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
        const customOrderData = {
            userId: req.user.id,
            image: req.file ? `/uploads/${req.file.filename}` : '',
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
                    image: product.image,
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
                    image: product.image,
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

app.get('/api/testimonials', async (req, res) => {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
});

app.post('/api/testimonials', auth, upload.single('image'), async (req, res) => {
    console.log('Received authenticated request to add testimonial:', req.body);
    try {
        // Get user name
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const testimonialData = {
            ...req.body,
            name: user.name,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            userId: req.user.id,
        };
        let savedItem;
        if (testimonialData.productId) {
            // Save as product review
            const productReview = new ProductReview(testimonialData);
            savedItem = await productReview.save();
            console.log('Product review saved successfully:', savedItem);
        } else {
            // Save as general testimonial
            const testimonial = new Testimonial(testimonialData);
            savedItem = await testimonial.save();
            console.log('Testimonial saved successfully:', savedItem);
        }
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error saving review:', error.stack || error);
        res.status(500).json({ message: 'Failed to save review' });
    }
});

app.get('/api/featured-collections', async (req, res) => {
    const collections = await FeaturedCollection.find();
    res.json(collections);
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
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ name, email, password: hashedPassword });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
