import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};
const upload = multer({ storage, fileFilter });

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
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      const filename = Date.now() + '.jpg';
      const filepath = path.join(uploadDir, filename);
      try {
        await sharp(req.file.buffer)
          .resize(200, 200, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(filepath);
        updateData.image = `/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ message: 'Error processing image' });
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
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      const filename = Date.now() + '.jpg';
      const filepath = path.join(uploadDir, filename);
      try {
        await sharp(req.file.buffer)
          .resize(200, 200, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(filepath);
        newUserData.image = `/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ message: 'Error processing image' });
      }
    }

    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error.stack || error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
