import express from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import { upload, uploadSingleImage } from '../services/uploadService.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, mobile, address, email } = req.body;

    // Clean updateData by removing undefined or empty string fields
    const updateData = {};
    if (name !== undefined && name !== '') updateData.name = name;
    if (username !== undefined && username !== '') updateData.username = username;
    if (mobile !== undefined && mobile !== '') updateData.mobile = mobile;
    if (address !== undefined && address !== '') updateData.address = address;
    if (email !== undefined && email !== '') updateData.email = email;

    if (req.file) {
      try {
        // Upload to Cloudinary instead of local storage
        const result = await uploadSingleImage(req.file, 'profile-pictures');
        updateData.image = result.secure_url;
        console.log('Cloudinary upload successful:', result.secure_url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updated user data:', updatedUser);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error.stack || error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route with image upload support
router.post('/signup', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const newUserData = { name, email, password };

    if (req.file) {
      try {
        // Upload to Cloudinary instead of local storage
        const result = await uploadSingleImage(req.file, 'profile-pictures');
        newUserData.image = result.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const newUser = new User(newUserData);
    await newUser.save();

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET || "test",
      { expiresIn: "1h" }
    );

    console.log("User created successfully:", newUser.email);
    console.log("Token generated:", token ? "Yes" : "No");

    res.status(201).json({ 
      message: 'User created successfully',
      result: newUser,
      token: token
    });
  } catch (error) {
    console.error('Error during signup:', error.stack || error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
