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
 * - External URL “hot path” optimization to prevent flicker
 * - Memoized for performance
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
  const [imageSrc, setImageSrc] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);

  // Detect if incoming src is an “external” URL string
  const isExternalUrl = typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'));

  // Unique container ID for IntersectionObserver
  const imageId = `img-${alt?.replace(/\s+/g, '-')}-${typeof src === 'string'
      ? src.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')
      : 'local-file'}`;

  // 1️⃣ Initialize imageSrc based on File vs external URL
  useEffect(() => {
    if (!src) return;

    // Local File → create blob URL
    if (src instanceof File) {
      const url = URL.createObjectURL(src);
      setImageSrc(url);
      setObjectUrl(url);
      return;
    }

    // External URL or already‑created blob
    if (isExternalUrl) {
      setImageSrc(src);
      return;
    }

    // Otherwise clear
    setImageSrc('');
  }, [src, isExternalUrl]);

  // 2️⃣ Cleanup blob URL when done
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  // 3️⃣ Lazy‑loading for non‑external, non‑loaded src
  useEffect(() => {
    if (
        !lazyLoad ||
        imageSrc ||
        isExternalUrl
    ) return;

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Once visible, do the same logic as above
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
        { rootMargin: '100px', threshold: 0.1 }
    );

    const el = document.getElementById(imageId);
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [src, imageSrc, lazyLoad, isExternalUrl, imageId]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
      <div
          id={imageId}
          style={{
            position: 'relative',
            width: width || '100%',
            height: height || 'auto',
            backgroundColor: placeholderColor,
            overflow: 'hidden',
          }}
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
            decoding="async"
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
