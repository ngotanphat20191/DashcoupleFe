import { FaPlus, FaTimes } from "react-icons/fa";
import OptimizedImage from "../../shared/OptimizedImage";
import { optimizeImage, cleanupImageUrl } from "../../../utils/imageUtils";
import "./editImage.css";
import { memo, useCallback } from "react";

const EditImage = ({ formData, setFormData }) => {
    // Handle adding an image
    const handleAddimage = useCallback((index) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*"; // Accept only images
        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    // Show loading state while optimizing
                    setFormData((prevData) => {
                        const newList = [...prevData.imagesList];
                        newList[index] = "loading";
                        return { ...prevData, imagesList: newList };
                    });

                    // Optimize the image with custom options
                    const { optimizedFile, imageUrl } = await optimizeImage(file, {
                        maxWidth: 800,
                        maxHeight: 800,
                        quality: 0.8
                    });

                    // Update form data with optimized image (in a single update for better performance)
                    setFormData((prevData) => {
                        const newimages = [...prevData.images];
                        const newList = [...prevData.imagesList];

                        newimages[index] = optimizedFile;
                        newList[index] = imageUrl;

                        return {
                            ...prevData,
                            images: newimages,
                            imagesList: newList
                        };
                    });
                } catch (error) {
                    console.error("Error optimizing image:", error);
                    // Fallback to original method if optimization fails
                    const imageUrl = URL.createObjectURL(file);

                    setFormData((prevData) => {
                        const newimages = [...prevData.images];
                        const newList = [...prevData.imagesList];

                        newimages[index] = file;
                        newList[index] = imageUrl;

                        return {
                            ...prevData,
                            images: newimages,
                            imagesList: newList
                        };
                    });
                }
            }
        };
        fileInput.click();
    }, [setFormData]);

    // Handle removing an image
    const handleRemoveimage = useCallback((index) => {
        // Revoke object URL to prevent memory leaks
        if (formData.imagesList[index] && typeof formData.imagesList[index] === 'string' &&
            formData.imagesList[index] !== "loading") {
            cleanupImageUrl(formData.imagesList[index]);
        }

        // Update form data (in a single update for better performance)
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
                                            <span>Optimizing...</span>
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