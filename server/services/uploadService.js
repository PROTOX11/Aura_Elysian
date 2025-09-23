import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for memory storage (for Cloudinary uploads)
const memoryStorage = multer.memoryStorage();
const upload = multer({ 
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure multer for local file storage (for different content types)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on the endpoint or content type
    let subDir = 'products'; // default
    const url = req.originalUrl || req.url;

    if (url.includes('testimonials')) {
      subDir = 'testimonials';
    } else if (url.includes('featured-collections')) {
      subDir = 'collections';
    } else if (url.includes('productreviews')) {
      subDir = 'reviews';
    } else if (url.includes('products')) {
      subDir = 'products';
    }
    const uploadPath = path.join(process.cwd(), 'uploads', subDir);
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    cb(null, filename);
  }
});

const localUpload = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload single image to Cloudinary
const uploadSingleImage = async (file, folder = 'aura-elysian') => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      {
        folder: `aura-elysian/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' }
        ]
      }
    );
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Upload multiple images to Cloudinary
const uploadMultipleImages = async (files, folder = 'aura-elysian') => {
  try {
    const uploadPromises = files.map(file => uploadSingleImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    width: options.width || 'auto',
    height: options.height || 'auto',
    crop: options.crop || 'limit'
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Local file upload functions
const uploadSingleImageLocally = (file) => {
  // This function is called after multer has already saved the file
  // Return the local file path
  const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
  const relativePath = path.relative(path.join(process.cwd(), 'server'), file.path);
  return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
};

const uploadMultipleImagesLocally = (files) => {
  // This function is called after multer has already saved the files
  // Return the local file paths
  const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return files.map(file => {
    const relativePath = path.relative(path.join(process.cwd(), 'server'), file.path);
    return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
  });
};

export {
  upload,
  localUpload,
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleImageLocally,
  uploadMultipleImagesLocally,
  deleteImage,
  getOptimizedImageUrl
};
