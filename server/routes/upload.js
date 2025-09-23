import express from 'express';
import { upload, uploadSingleImage, uploadMultipleImages } from '../services/uploadService.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Single image upload endpoint
router.post('/single', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const folder = req.body.folder || 'aura-elysian';
    const result = await uploadSingleImage(req.file, folder);
    
    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Error uploading single image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Multiple images upload endpoint
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const folder = req.body.folder || 'aura-elysian';
    const results = await uploadMultipleImages(req.files, folder);
    
    const response = results.map(result => ({
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    }));
    
    res.json(response);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

export default router;
