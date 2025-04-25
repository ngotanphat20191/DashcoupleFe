import React, { memo, useCallback } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import OptimizedImage from '../../shared/OptimizedImage.jsx'; // Adjust the import path as needed
import './editImage.css';

const EditImage = ({ formData, setFormData }) => {
    // Add or replace image at slot `index`
    const handleAddImage = useCallback(
        (index) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                // *** THIS IS WHERE IT HAPPENS ***
                // Create a temporary URL (blob:...) for preview
                const objectUrl = URL.createObjectURL(file);
                // ********************************

                setFormData((prev) => {
                    const newFiles = [...prev.images];
                    const newList = [...prev.imagesList];

                    // Revoke previous object URL if it exists for this slot
                    const previousUrl = newList[index];
                    if (previousUrl && typeof previousUrl === 'string' && previousUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(previousUrl);
                    }

                    newFiles[index] = file;      // Store the actual File object
                    // *** AND HERE IT'S STORED FOR DISPLAY ***
                    newList[index] = objectUrl;  // Store the Object URL (blob:...) for display
                    // ****************************************

                    return { ...prev, images: newFiles, imagesList: newList };
                });
            };
            fileInput.click();
        },
        [setFormData]
    );
    // Remove image at slot `index`
    const handleRemoveImage = useCallback(
        (index) => {
            setFormData((prev) => {
                const newFiles = [...prev.images];
                const newList = [...prev.imagesList];

                // Get the URL to revoke *before* clearing the list
                const urlToRevoke = newList[index];

                newFiles[index] = null;
                newList[index] = null;

                // Revoke the object URL if it exists
                if (urlToRevoke && typeof urlToRevoke === 'string' && urlToRevoke.startsWith('blob:')) {
                    URL.revokeObjectURL(urlToRevoke);
                }

                return { ...prev, images: newFiles, imagesList: newList };
            });
        },
        [setFormData] // Removed formData.imagesList dependency as we get it inside setFormData
    );

    // Cleanup object URLs on component unmount
    React.useEffect(() => {
        return () => {
            formData.imagesList.forEach(url => {
                if (url && typeof url === 'string' && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [formData.imagesList]); // Effect runs when imagesList changes, cleanup runs on unmount

    return (
        <div className="editImage">
            <div className="editphoto-grid">
                {/* Make sure formData.imagesList is always an array */}
                {(formData.imagesList || []).map((imageUrl, idx) => (
                    <div key={idx} className="editphoto-slot">
                        {imageUrl ? (
                            <>
                                <OptimizedImage
                                    // Pass the URL (string or blob: string)
                                    src={imageUrl}
                                    alt={`Uploaded image ${idx + 1}`}
                                    width="100%"
                                    height="100%" // Ensure OptimizedImage container takes up space
                                    placeholderColor="#f8e1f4"
                                    lazyLoad // Keep lazy loading if needed
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

// Ensure formData and setFormData are stable if possible,
// or consider wrapping EditImage in React.memo carefully if performance dictates.
// export default memo(EditImage); <-- Use memo if props are stable
export default EditImage; // Start without memo unless performance profiling shows it's needed