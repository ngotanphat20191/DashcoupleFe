import React, { useState, useEffect, memo } from 'react';

/**
 * ImagePreloader - A component that preloads images for faster display
 * 
 * This component preloads images in the background and caches them
 * for immediate display when needed.
 */
const ImagePreloader = ({ images = [], currentIndex = 0 }) => {
  useEffect(() => {
    // Preload the current image and the next few images
    const imagesToPreload = [];
    const maxImagesToPreload = 3; // Preload current and next 2 images
    
    for (let i = 0; i < maxImagesToPreload; i++) {
      const index = (currentIndex + i) % images.length;
      if (images[index]) {
        imagesToPreload.push(images[index]);
      }
    }
    
    // Create image objects to trigger browser caching
    imagesToPreload.forEach(src => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [images, currentIndex]);
  
  // This component doesn't render anything visible
  return null;
};

export default memo(ImagePreloader);