import React, { useState, useEffect, memo } from 'react';
import { Skeleton } from '@mui/material';

/**
 * OptimizedImage component for faster image loading
 *
 * Supports:
 * - URL string or local File object as src
 * - Lazy loading with IntersectionObserver
 * - Progressive loading with Skeleton
 * - Error fallback image
 * - Memoized for performance
 */
const OptimizedImage = ({src, alt, className, width, height, placeholderColor = "#f0f0f0", fallbackSrc = "https://via.placeholder.com/150?text=Image+Not+Found", lazyLoad = true, ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [objectUrl, setObjectUrl] = useState(null); // for local file cleanup

  // Generate a unique ID for the image container
  const imageId = `image-${alt?.replace(/\s+/g, '-')}-${typeof src === 'string' ? src?.substring(0, 20)?.replace(/[^a-zA-Z0-9]/g, '') : 'local-file'}`;

  // Handle src updates
  useEffect(() => {
    if (!src) return;

    // File object (e.g., from input)
    if (src instanceof File) {
      const url = URL.createObjectURL(src);
      setImageSrc(url);
      setObjectUrl(url);
      return;
    }

    // External URL or blob
    if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'))) {
      setImageSrc(src);
      return;
    }

    setImageSrc('');
  }, [src]);

  // Cleanup created object URL
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  // Lazy load logic with IntersectionObserver
  useEffect(() => {
    if (!lazyLoad || imageSrc || (typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:')))) return;

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (src instanceof File) {
                const url = URL.createObjectURL(src);
                setImageSrc(url);
                setObjectUrl(url);
              } else {
                setImageSrc(src);
              }
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        }
    );

    const imgElement = document.getElementById(imageId);
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement) observer.unobserve(imgElement);
    };
  }, [src, imageSrc, lazyLoad, imageId]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
      <div
          style={{
            position: 'relative',
            width: width || '100%',
            height: height || 'auto',
            backgroundColor: placeholderColor,
            overflow: 'hidden',
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
            alt={alt || 'Image'}
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
            loading="lazy"
            {...props}
        />
      </div>
  );
};

export default memo(OptimizedImage);
