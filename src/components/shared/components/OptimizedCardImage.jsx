import React, { memo } from 'react';
import OptimizedImage from '../../shared/OptimizedImage';

/**
 * OptimizedCardImage - A component for efficiently rendering profile card images
 * 
 * @param {string} src - The image source URL
 * @param {string} alt - Alt text for the image
 * @param {string} fallbackSrc - Fallback image to show if the main image fails to load
 */
const OptimizedCardImage = ({ src, alt, fallbackSrc = "https://i.ibb.co/LZPVKq9/card1.png" }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
      fallbackSrc={fallbackSrc}
      placeholderColor="#f8e1f4"
      lazyLoad={true}
    />
  );
};

export default memo(OptimizedCardImage);