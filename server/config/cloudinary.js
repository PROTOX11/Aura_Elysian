import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgiggtwoy',
  api_key: process.env.CLOUDINARY_API_KEY || '664998912519217',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1U4POW0PG7tLlWOxxWXf14QnYlI'
});

export default cloudinary;
