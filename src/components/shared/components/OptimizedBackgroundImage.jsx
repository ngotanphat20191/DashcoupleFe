import React, { useState, useEffect, memo } from 'react';

/**
 * OptimizedBackgroundImage - A component that optimizes background image loading
 * while maintaining the original background-image CSS approach
 * 
 * This component preloads images and only sets the background image
 * once the image is fully loaded, improving perceived performance.
 */
const OptimizedBackgroundImage = ({ src, style, className, children, ...props }) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) return;
    
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

  // Combine the provided style with our background image style
  const combinedStyle = {
    ...style,
    backgroundImage: loadedSrc ? `url(${loadedSrc})` : 'none',
    position: 'relative',
  };

  return (
    <div className={className} style={combinedStyle} {...props}>
      {/* Show a low-quality placeholder while loading */}
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f0f0f0',
            opacity: 0.5,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default memo(OptimizedBackgroundImage);