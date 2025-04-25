import React, { useState, useEffect, memo } from 'react';
import { Skeleton } from '@mui/material';

const OptimizedImage = ({
                            src,
                            alt = 'Image',
                            className,
                            width = '100%',
                            height = 'auto',
                            placeholderColor = '#f0f0f0',
                            fallbackSrc = 'https://via.placeholder.com/150?text=Image+Not+Found',
                            lazyLoad = true,
                            ...props
                        }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        if (!src) return;

        if (src instanceof File) {
            setImageSrc(src);
            setObjectUrl(src);
        } else if (typeof src === 'string') {
            setImageSrc(src);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    return (
        <div
            style={{
                position: 'relative',
                width,
                height,
                backgroundColor: placeholderColor,
                overflow: 'hidden',
            }}
        >
            {!isLoaded && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                />
            )}
            <img
                decoding="async"
                src={error ? fallbackSrc : imageSrc}
                alt={alt}
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
                loading={lazyLoad ? 'lazy' : 'eager'}
                {...props}
            />
        </div>
    );
};

export default memo(OptimizedImage);
