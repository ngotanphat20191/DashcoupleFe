import React, { useState, useEffect, memo, useRef } from 'react';
import { Skeleton } from '@mui/material';

const OptimizedImage = ({
                            src, // Expecting a string URL (http, https, blob, data)
                            alt = 'Image',
                            className,
                            width = '100%',
                            height = 'auto', // Can be '100%' if parent container controls size
                            placeholderColor = '#f0f0f0',
                            fallbackSrc = 'https://via.placeholder.com/150?text=Image+Not+Found',
                            lazyLoad = true,
                            ...props
                        }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    // Store the src prop in state to manage loading transitions
    const [currentSrc, setCurrentSrc] = useState(src);
    const imgRef = useRef(null); // Ref to access the img element

    useEffect(() => {
        // Reset state when the src prop *actually* changes
        if (src !== currentSrc) {
            setIsLoaded(false);
            setError(false);
            setCurrentSrc(src); // Update the internal src state
        }

        // Optional: Check if the image is already loaded (e.g., from cache)
        // This can sometimes prevent the skeleton flash for cached images
        const imgElement = imgRef.current;
        if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
            if (imgElement.src === src) { // Ensure it's the correct src
                setIsLoaded(true);
                setError(false);
            }
        }

    }, [src, currentSrc]); // Depend on external src and internal currentSrc

    const handleLoad = () => {
        // Only set loaded if the src matches the current prop src,
        // prevents race conditions if src changes quickly
        if (imgRef.current?.src === src) {
            setIsLoaded(true);
            setError(false);
        }
    };

    const handleError = () => {
        if (imgRef.current?.src === src) {
            setError(true);
            setIsLoaded(true); // Show fallback, hide skeleton
        }
    };

    // Determine the source to use for the img tag
    const imageSource = error ? fallbackSrc : currentSrc;

    return (
        <div
            style={{
                position: 'relative',
                width,
                height,
                backgroundColor: !isLoaded ? placeholderColor : 'transparent', // Show placeholder color only when loading
                overflow: 'hidden',
            }}
            className={className} // Apply className to the container div
        >
            {/* Show Skeleton only when loading and src is actually present */}
            {!isLoaded && currentSrc && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                    style={{ position: 'absolute', top: 0, left: 0 }} // Ensure skeleton covers the area
                />
            )}
            {/* Render the image tag only if there's a source to load */}
            {currentSrc && (
                <img
                    ref={imgRef}
                    decoding="async"
                    src={imageSource}
                    alt={alt}
                    // className={className} <-- Apply to container instead if it's for layout
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        display: 'block', // Always block, visibility controlled by opacity/parent
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: isLoaded && !error ? 1 : 0, // Fade in when loaded and no error
                    }}
                    loading={lazyLoad ? 'lazy' : 'eager'}
                    {...props}
                />
            )}
        </div>
    );
};

export default memo(OptimizedImage); // Memoization is generally good here