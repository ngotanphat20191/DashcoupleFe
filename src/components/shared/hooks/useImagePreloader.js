import { useState, useEffect } from 'react';

/**
 * useImagePreloader - A hook that preloads an image and returns its loading state
 * 
 * This hook helps improve image loading performance by preloading images
 * before they're displayed in the UI.
 * 
 * @param {string} src - The image URL to preload
 * @returns {Object} - An object containing the loaded source and loading state
 */
const useImagePreloader = (src) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // Create a new image object to preload the image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      // Once the image is loaded, set it as the background
      setLoadedSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      // If there's an error, we'll still stop the loading state
      setIsLoading(false);
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loadedSrc, isLoading };
};

export default useImagePreloader;