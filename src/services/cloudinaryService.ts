// Cloudinary configuration for frontend
export const cloudinaryConfig = {
  cloudName: 'dgiggtwoy',
  apiKey: '664998912519217',
  // Note: API secret should never be exposed in frontend code
  // All uploads should go through the backend for security
};

// Helper function to get optimized image URLs
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number | string;
    height?: number | string;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`
  ].join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformations}/${publicId}`;
};

// Helper function to get thumbnail URLs
export const getThumbnailUrl = (publicId: string, size: number = 300) => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto'
  });
};

// Helper function to get responsive image URLs
export const getResponsiveImageUrl = (publicId: string, width: number) => {
  return getOptimizedImageUrl(publicId, {
    width,
    height: 'auto',
    quality: 'auto',
    format: 'auto'
  });
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
};

// Helper function to get different image sizes for responsive design
export const getResponsiveImageSet = (publicId: string) => {
  return {
    thumbnail: getThumbnailUrl(publicId, 150),
    small: getResponsiveImageUrl(publicId, 400),
    medium: getResponsiveImageUrl(publicId, 800),
    large: getResponsiveImageUrl(publicId, 1200),
    original: `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${publicId}`
  };
};
