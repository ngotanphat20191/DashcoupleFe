/**
 * Utility functions for image optimization and management
 */

// Cache for storing optimized image URLs
const imageCache = new Map();

/**
 * Optimizes an image by resizing and compressing it
 * 
 * @param {File} file - The original image file
 * @param {Object} options - Optimization options
 * @param {number} options.maxWidth - Maximum width of the optimized image (default: 800)
 * @param {number} options.maxHeight - Maximum height of the optimized image (default: 800)
 * @param {number} options.quality - JPEG quality (0-1) (default: 0.8)
 * @returns {Promise<{optimizedFile: File, imageUrl: string}>} - The optimized file and its URL
 */
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8
  } = options;
  
  // Check if image is already in cache
  const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Create a new image element to load the file
      const img = new Image();
      
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        // Resize the image
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with reduced quality
        canvas.toBlob((blob) => {
          // Create a new file from the blob
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          // Create a URL for the optimized image
          const imageUrl = URL.createObjectURL(optimizedFile);
          
          // Store in cache
          const result = { optimizedFile, imageUrl };
          imageCache.set(cacheKey, result);
          
          resolve(result);
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Load the image from the file
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Preloads an image to ensure it's in the browser cache
 * 
 * @param {string} src - The image URL to preload
 * @returns {Promise<void>} - Resolves when the image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

/**
 * Cleans up an image URL by revoking the object URL
 * 
 * @param {string} url - The object URL to revoke
 */
export const cleanupImageUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Clears the image cache
 */
export const clearImageCache = () => {
  // Revoke all object URLs
  imageCache.forEach(({ imageUrl }) => {
    cleanupImageUrl(imageUrl);
  });
  
  // Clear the cache
  imageCache.clear();
};

/**
 * Converts a base64 string to a File object
 * 
 * @param {string} base64 - The base64 string
 * @param {string} filename - The filename to use
 * @param {string} mimeType - The MIME type of the file
 * @returns {File} - The created File object
 */
export const base64ToFile = (base64, filename, mimeType = 'image/jpeg') => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new File([ab], filename, { type: mimeType });
};