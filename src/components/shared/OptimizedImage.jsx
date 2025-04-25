import React, { useState, useEffect, memo, useRef } from 'react';
import { Skeleton } from '@mui/material';

/**
 * OptimizedImage
 * - src: either an HTTP URL string or a File/Blob object
 * - lazyLoad: boolean to enable IntersectionObserver
 * - shows a Skeleton until the actual image loads
 */
const OptimizedImage = ({
                            src,
                            alt,
                            className,
                            width,
                            height,
                            placeholderColor = "#f0f0f0",
                            fallbackSrc = "https://via.placeholder.com/150?text=Image+Not+Found",
                            lazyLoad = false,
                            ...props
                        }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError]     = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const objectUrlRef = useRef(null);
    const containerRef = useRef(null);

    // Now only HTTP(S) URLs are “external”
    const isExternalUrl = typeof src === 'string' && /^https?:\/\//.test(src);

    // 1️⃣ Initialize imageSrc from Blob/File or external URL
    useEffect(() => {
        if (!src) return;

        if (src instanceof Blob) {
            // Create a blob URL for any File/Blob
            const url = URL.createObjectURL(src);
            setImageSrc(url);
            objectUrlRef.current = url;
            return;
        }

        if (isExternalUrl) {
            // Use remote HTTP(S) URL directly
            setImageSrc(src);
            return;
        }

        // Otherwise clear out
        setImageSrc('');
    }, [src, isExternalUrl]);

    // 2️⃣ Cleanup: revoke created blob URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    // 3️⃣ Lazy-loading: observe the container if desired
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
