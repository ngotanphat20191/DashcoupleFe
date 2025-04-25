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

    // Determine if src is a File object
    const isFileObject = src instanceof File;

    // Generate a unique ID for the image container
    const imageId = `img-${alt?.replace(/\s+/g, '-')}-${isFileObject ? 'local-file' : src?.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}`;

    // Initialize imageSrc based on File vs external URL
    useEffect(() => {
        if (!src) return;

        if (isFileObject) {
            const url = URL.createObjectURL(src);
            setImageSrc(url);
            setObjectUrl(url);
        } else if (typeof src === 'string') {
            setImageSrc(src);
        } else {
            setImageSrc('');
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    // Lazy loading for non-external, non-loaded src
    useEffect(() => {
        if (!lazyLoad || imageSrc || isFileObject) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setImageSrc(src);
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
    }, [src, imageSrc, lazyLoad, isFileObject, imageId]);

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
