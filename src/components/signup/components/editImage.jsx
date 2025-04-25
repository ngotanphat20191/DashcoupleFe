import { FaPlus, FaTimes } from "react-icons/fa";
import OptimizedImage from "../../shared/OptimizedImage";
import "./editImage.css";
import { memo, useCallback } from "react";

const EditImage = ({ formData, setFormData }) => {
    // Handle adding an image
    const handleAddimage = useCallback((index) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*"; // Accept only images
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Create blob URL directly
                const blobUrl = URL.createObjectURL(file);

                // Update form data with blob URL and original file
                setFormData((prevData) => {
                    const newimages = [...prevData.images];
                    const newList = [...prevData.imagesList];

                    // Store original file for ImgBB upload
                    newimages[index] = file;
                    // Store blob URL for display
                    newList[index] = blobUrl;

                    return {
                        ...prevData,
                        images: newimages,
                        imagesList: newList
                    };
                });
            }
        };
        fileInput.click();
    }, [setFormData]);

    // Handle removing an image
    const handleRemoveimage = useCallback((index) => {
        // Revoke object URL to prevent memory leaks
        if (formData.imagesList[index] && typeof formData.imagesList[index] === 'string' &&
            formData.imagesList[index] !== "loading") {
            // Use direct URL.revokeObjectURL instead of cleanupImageUrl
            URL.revokeObjectURL(formData.imagesList[index]);
        }

        // Update form data
        setFormData((prevData) => {
            const newimages = [...prevData.images];
            const newList = [...prevData.imagesList];

            newimages[index] = null;
            newList[index] = null;

            return {
                ...prevData,
                images: newimages,
                imagesList: newList
            };
        });
    }, [formData.imagesList, setFormData]);

    return (
        <div>
            <div className="editImage">
                <div className="editphoto-grid">
                    {formData.imagesList.map((image, index) => (
                        <div key={index} className="editphoto-slot">
                            {image ? (
                                <div>
                                    {image === "loading" ? (
                                        <div className="loading-placeholder">
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <OptimizedImage
                                                src={image}
                                                alt={`Upload ${index + 1}`}
                                                width="100%"
                                                height="100%"
                                                placeholderColor="#f8e1f4"
                                                lazyLoad={true}
                                            />
                                            <button
                                                className="remove"
                                                onClick={() => handleRemoveimage(index)}
                                                aria-label="Remove image"
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className="add"
                                    onClick={() => handleAddimage(index)}
                                    aria-label="Add image"
                                >
                                    <FaPlus />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(EditImage);