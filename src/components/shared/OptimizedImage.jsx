import React, { useState, useEffect, memo, useRef } from 'react';
import { Skeleton } from '@mui/material';

/**
 * OptimizedImage component for faster image loading
 *
 * - Supports URL strings and local File/Blob objects as `src`
 * - Lazy loading via IntersectionObserver (opt-in)
 * - Progressive loading placeholder with MUI Skeleton
 * - Error fallback image
 * - Cleans up created blob URLs on unmount
 */
const OptimizedImage = ({
                            src,
                            alt,
                            className,
                            width,
                            height,
                            placeholderColor = "#f0f0f0",
                            fallbackSrc = "https://via.placeholder.com/150?text=Image+Not+Found",
                            lazyLoad = false,    // default off for immediate load; toggle true if you want lazy
                            ...props
                        }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError]     = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const objectUrlRef = useRef(null);
    const containerRef = useRef(null);

    const isExternalUrl = typeof src === 'string' && (src.startsWith('http') || src.startsWith('blob:'));

    // 1️⃣ Initialize imageSrc based on Blob vs external URL
    useEffect(() => {
        if (!src) return;

        // Accept both File and Blob
        if (src instanceof Blob) {
            const url = URL.createObjectURL(src);
            setImageSrc(url);
            objectUrlRef.current = url;
            return;
        }

        if (isExternalUrl) {
            setImageSrc(src);
            return;
        }

        // Otherwise clear
        setImageSrc('');
    }, [src, isExternalUrl]);

    // 2️⃣ Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    // 3️⃣ Lazy-load support
    useEffect(() => {
        if (!lazyLoad || imageSrc || isExternalUrl) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (src instanceof Blob) {
                        const url = URL.createObjectURL(src);
                        setImageSrc(url);
                        objectUrlRef.current = url;
                    } else {
                        setImageSrc(src);
                    }
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px', threshold: 0.1 });

        if (containerRef.current) obs.observe(containerRef.current);
        return () => {
            if (containerRef.current) obs.unobserve(containerRef.current);
        };
    }, [src, imageSrc, lazyLoad, isExternalUrl]);

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width:  width  || '100%',
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

            {/* Simple debug fallback: replace with above <Skeleton> logic if desired */}
            <img
                decoding="async"
                src={error ? fallbackSrc : imageSrc}
                alt={alt || 'Image'}
                className={className}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    display:    isLoaded ? 'block' : 'none',
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity:    isLoaded ? 1 : 0,
                }}
                loading={lazyLoad ? 'lazy' : 'eager'}
                {...props}
            />
        </div>
    );
};

export default memo(OptimizedImage);
