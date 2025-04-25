import React, { memo, useCallback, useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import OptimizedImage from '../../shared/OptimizedImage.jsx'; // Adjust the import path as needed
import './editImage.css'; // Assuming you have some CSS

const EditImage = ({ formData, setFormData }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({}); // To track individual uploads

    const handleAddImage = useCallback(
        (index) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const objectUrl = URL.createObjectURL(file);

                setFormData((prev) => {
                    const newFiles = [...prev.images];
                    const newList = [...prev.imagesList];

                    const previousUrl = newList[index];
                    if (previousUrl && typeof previousUrl === 'string' && previousUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(previousUrl);
                    }

                    newFiles[index] = file;
                    newList[index] = objectUrl;

                    return { ...prev, images: newFiles, imagesList: newList };
                });
            };
            fileInput.click();
        },
        [setFormData]
    );

    const handleRemoveImage = useCallback(
        (index) => {
            setFormData((prev) => {
                const newFiles = [...prev.images];
                const newList = [...prev.imagesList];

                const urlToRevoke = newList[index];

                newFiles[index] = null;
                newList[index] = null;

                if (urlToRevoke && typeof urlToRevoke === 'string' && urlToRevoke.startsWith('blob:')) {
                    URL.revokeObjectURL(urlToRevoke);
                }

                return { ...prev, images: newFiles, imagesList: newList };
            });
        },
        [setFormData]
    );

    const uploadImageToImgbb = useCallback(async (file, index) => {
        if (!file) return null;

        const apiKey = 'YOUR_IMGBB_API_KEY'; // Replace with your actual API key
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Imgbb upload failed for image ${index}:`, errorData);
                return null;
            }

            const responseData = await response.json();
            return responseData.data;
        } catch (error) {
            console.error(`Error uploading to Imgbb for image ${index}:`, error);
            return null;
        } finally {
            setUploadProgress(prev => ({ ...prev, [index]: undefined })); // Clear progress
        }
    }, []);

    const handleUploadAll = useCallback(async () => {
        if (!formData.images || formData.images.length === 0) {
            console.log("No images to upload.");
            return;
        }

        setUploading(true);
        const uploadedUrls = [];
        const newUploadedList = [...(formData.uploadedUrls || [])]; // Assuming you want to store uploaded URLs

        for (let i = 0; i < formData.images.length; i++) {
            const file = formData.images[i];
            if (file) {
                setUploadProgress(prev => ({ ...prev, [i]: 'uploading' }));
                const uploadResult = await uploadImageToImgbb(file, i);
                if (uploadResult && uploadResult.url) {
                    uploadedUrls.push(uploadResult.url);
                    newUploadedList[i] = uploadResult.url; // Store the imgbb URL
                    console.log(`Image ${i} uploaded:`, uploadResult.url);
                } else {
                    console.error(`Failed to upload image ${i}.`);
                    newUploadedList[i] = 'failed'; // Indicate upload failure
                }
            }
        }

        setFormData(prev => ({ ...prev, uploadedUrls: newUploadedList }));
        setUploading(false);
        console.log("All uploads finished. Uploaded URLs:", uploadedUrls);
        // Optionally, you can trigger a state update or callback here to inform the parent component
    }, [formData.images, setFormData, uploadImageToImgbb]);

    useEffect(() => {
        return () => {
            formData.imagesList.forEach(url => {
                if (url && typeof url === 'string' && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [formData.imagesList]);

    return (
        <div className="editImage">
            <div className="editphoto-grid">
                {(formData.imagesList || []).map((imageUrl, idx) => (
                    <div key={idx} className="editphoto-slot">
                        {imageUrl ? (
                            <>
                                <OptimizedImage
                                    src={imageUrl}
                                    alt={`Uploaded image ${idx + 1}`}
                                    width="100%"
                                    height="100%"
                                    placeholderColor="#f8e1f4"
                                    lazyLoad
                                />
                                <button
                                    className="remove"
                                    onClick={() => handleRemoveImage(idx)}
                                    aria-label="Remove image"
                                >
                                    <FaTimes />
                                </button>
                                {uploadProgress[idx] === 'uploading' && (
                                    <div className="upload-status">Uploading...</div>
                                )}
                                {formData.uploadedUrls && formData.uploadedUrls[idx] && formData.uploadedUrls[idx] !== 'failed' && (
                                    <div className="upload-success">Uploaded!</div>
                                )}
                                {formData.uploadedUrls && formData.uploadedUrls[idx] === 'failed' && (
                                    <div className="upload-failed">Upload Failed</div>
                                )}
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
            <button onClick={handleUploadAll} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload All Images'}
            </button>
        </div>
    );
};

export default memo(EditImage);