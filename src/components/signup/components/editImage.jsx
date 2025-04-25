import { FaPlus, FaTimes } from "react-icons/fa";
import OptimizedImage from "../../shared/OptimizedImage";
import "./editImage.css";
import { memo, useCallback } from "react";

const EditImage = ({ formData, setFormData }) => {
    // Handle adding an image
    const handleAddImage = useCallback((index) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Create a blob URL for immediate display
                const blobUrl = URL.createObjectURL(file);

                console.log("Created blob URL:", blobUrl); // Debug output

                // Update form data with file and blob URL
                setFormData((prevData) => {
                    // Make copies of arrays to avoid mutating state directly
                    const newImages = [...prevData.images];
                    // Create imagesList array if it doesn't exist
                    const newList = prevData.imagesList ? [...prevData.imagesList] :
                        Array(prevData.images.length).fill(null);

                    // Store file for later upload
                    newImages[index] = file;
                    // Store blob URL for immediate display
                    newList[index] = blobUrl;

                    console.log("Updated imagesList:", newList); // Debug output

                    return {
                        ...prevData,
                        images: newImages,
                        imagesList: newList
                    };
                });
            }
        };

        fileInput.click();
    }, [setFormData]);

    // Handle removing an image
    const handleRemoveImage = useCallback((index) => {
        // Clean up blob URL to prevent memory leaks
        if (formData.imagesList &&
            formData.imagesList[index] &&
            typeof formData.imagesList[index] === 'string' &&
            formData.imagesList[index].startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagesList[index]);
        }

        // Update form data
        setFormData((prevData) => {
            const newImages = [...prevData.images];
            // Create imagesList array if it doesn't exist
            const newList = prevData.imagesList ? [...prevData.imagesList] :
                Array(prevData.images.length).fill(null);

            newImages[index] = null;
            newList[index] = null;

            return {
                ...prevData,
                images: newImages,
                imagesList: newList
            };
        });
    }, [formData, setFormData]);

    // Ensure imagesList exists
    const imagesList = formData.imagesList || Array(formData.images.length).fill(null);

    return (
        <div>
            <div className="editImage">
                <div className="editphoto-grid">
                    {formData.imagesList.map((_, index) => (
                        <div key={index} className="editphoto-slot">
                            {formData.images[index] ? (
                                <div>
                                    <OptimizedImage
                                        src={formData.images[index]}
                                        alt={`Upload ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        placeholderColor="#f8e1f4"
                                        lazyLoad={true}
                                    />
                                    <button
                                        className="remove"
                                        onClick={() => handleRemoveImage(index)}
                                        aria-label="Remove image"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="add"
                                    onClick={() => handleAddImage(index)}
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

export default memo(EditImage);