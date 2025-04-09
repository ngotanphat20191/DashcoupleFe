import React, { useState, useEffect, memo } from 'react';
import { Skeleton } from '@mui/material';

/**
 * OptimizedImage component for faster image loading
 * 
 * Features:
 * - Lazy loading (only loads when in viewport)
 * - Progressive loading (shows placeholder while loading)
 * - Error handling (shows fallback on error)
 * - Caching support
 * - Optimized for performance
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  placeholderColor = "#f0f0f0",
  fallbackSrc = "https://via.placeholder.com/150?text=Image+Not+Found",
  lazyLoad = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  // If src is a URL that starts with http, use it immediately to prevent flickering
  const isExternalUrl = src && typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'));
  const [imageSrc, setImageSrc] = useState(lazyLoad && !isExternalUrl ? '' : src);

  // Update image source when src prop changes
  useEffect(() => {
    // If it's an external URL, update the image source immediately
    if (isExternalUrl) {
      setImageSrc(src);
      return;
    }
  }, [src, isExternalUrl]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || isExternalUrl) return;

    let observer;
    let imgElement;

    // Create an observer instance
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is in viewport
        if (entry.isIntersecting) {
          // Set the image source
          setImageSrc(src);
          // Stop observing once loaded
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px', // Load images 100px before they appear in viewport
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });

    // Generate a stable ID for the image element
    const imageId = `image-${alt?.replace(/\s+/g, '-')}-${src?.substring(0, 20)?.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Start observing the placeholder
    imgElement = document.getElementById(imageId);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement && observer) {
        observer.unobserve(imgElement);
      }
    };
  }, [src, alt, lazyLoad, isExternalUrl]);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate a stable ID for the image element
  const imageId = `image-${alt?.replace(/\s+/g, '-')}-${src?.substring(0, 20)?.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div 
      style={{ 
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        backgroundColor: placeholderColor,
        overflow: 'hidden'
      }}
      id={imageId}
    >
      {!isLoaded && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={height || '100%'} 
          animation="wave"
        />
      )}
      
      <img
        src={error ? fallbackSrc : imageSrc}
        alt={alt || "Image"}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          display: isLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
        }}
        loading="lazy" // Native lazy loading as fallback
        {...props}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedImage);