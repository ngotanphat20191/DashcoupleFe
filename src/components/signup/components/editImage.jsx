import React, { memo, useCallback } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';
import './editImage.css';

/**
 * EditImage: grid of slots where each slot can:
 *  - show an “Add” button if empty
 *  - show a preview + remove button if URL/Blob is present
 */
const EditImage = ({ formData, setFormData }) => {
    // Create object URL for a File/Blob
    const makeObjectUrl = useCallback(file => URL.createObjectURL(file), []);

    // Add/replace slot at `index`
    const handleAddImage = useCallback((index) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const url = makeObjectUrl(file);

            setFormData(prev => {
                const imgs = [...prev.images];
                const list = [...prev.imagesList];
                imgs[index] = file;  // store File if needed
                list[index] = url;   // store preview URL
                return { ...prev, images: imgs, imagesList: list };
            });
        };
        fileInput.click();
    }, [makeObjectUrl, setFormData]);

    // Remove slot at `index`
    const handleRemoveImage = useCallback((index) => {
        const url = formData.imagesList[index];
        if (url) {
            URL.revokeObjectURL(url);
        }
        setFormData(prev => {
            const imgs = [...prev.images];
            const list = [...prev.imagesList];
            imgs[index] = null;
            list[index]   = null;
            return { ...prev, images: imgs, imagesList: list };
        });
    }, [formData.imagesList, setFormData]);

    return (
        <div className="editImage">
            <div className="editphoto-grid">
                {formData.imagesList.map((slot, idx) => (
                    <div key={idx} className="editphoto-slot">
                        {slot ? (
                            <>
                                <OptimizedImage
                                    src={slot}
                                    alt={`Uploaded image ${idx + 1}`}
                                    width="100%"
                                    height="100%"
                                    placeholderColor="#f8e1f4"
                                    lazyLoad={false}
                                />
                                <button
                                    className="remove"
                                    onClick={() => handleRemoveImage(idx)}
                                    aria-label="Remove image"
                                >
                                    <FaTimes />
                                </button>
                            </>
                        ) : (
                            <button
                                className="add"
                                onClick={() => handleAddImage(idx)}
                                aria-label="Add image"
                            >
                                <FaPlus />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(EditImage);
