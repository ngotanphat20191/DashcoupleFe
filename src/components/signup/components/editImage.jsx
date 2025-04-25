import React, { memo, useCallback } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import OptimizedImage from '../../shared/OptimizedImage.jsx';  // adjust path
import './editImage.css';

/**
 * EditImage: displays a grid of slots
 * - Empty slot: “Add” button
 * - Filled slot: image preview + remove button
 * - Uses OptimizedImage for previews
 */
const EditImage = ({ formData, setFormData }) => {
    // Helper to create blob URL for preview
    const makeObjectUrl = useCallback(file => URL.createObjectURL(file), []);

    // Handler to add/replace an image in slot `index`
    const handleAddImage = useCallback(index => {
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
                imgs[index] = file;   // store the File itself
                list[index] = url;    // store the blob URL for preview
                return { ...prev, images: imgs, imagesList: list };
            });
        };
        fileInput.click();
    }, [makeObjectUrl, setFormData]);

    // Handler to remove an image from slot `index`
    const handleRemoveImage = useCallback(index => {
        const url = formData.imagesList[index];
        if (url) {
            URL.revokeObjectURL(url);  // free memory
        }
        setFormData(prev => {
            const imgs = [...prev.images];
            const list = [...prev.imagesList];
            imgs[index] = null;
            list[index] = null;
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
