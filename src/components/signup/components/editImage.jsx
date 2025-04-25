import { FaPlus, FaTimes } from "react-icons/fa";
import OptimizedImage from "../../shared/OptimizedImage"; // or use <img>
import "./editImage.css";
import { memo, useCallback } from "react";

const EditImage = ({ formData, setFormData }) => {
    // Create object URL for a File
    const makeObjectUrl = useCallback(file => URL.createObjectURL(file), []);

    // Add or replace image at slot `index`
    const handleAddImage = useCallback(
        index => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.onchange = event => {
                const file = event.target.files[0];
                if (!file) return;

                // Immediately generate URL for preview
                const url = makeObjectUrl(file);

                setFormData(prev => {
                    const newFiles = [...prev.images];
                    const newList = [...prev.imagesList];
                    newFiles[index] = file;      // keep the File if you need it later
                    newList[index] = url;        // store the preview URL
                    return { ...prev, images: newFiles, imagesList: newList };
                });
            };
            fileInput.click();
        },
        [makeObjectUrl, setFormData]
    );

    // Remove image at slot `index`
    const handleRemoveImage = useCallback(
        index => {
            const url = formData.imagesList[index];
            if (url) {
                // Revoke the object URL to free memory
                URL.revokeObjectURL(url);
            }

            setFormData(prev => {
                const newFiles = [...prev.images];
                const newList  = [...prev.imagesList];
                newFiles[index] = null;
                newList[index]  = null;
                return { ...prev, images: newFiles, imagesList: newList };
            });
        },
        [formData.imagesList, setFormData]
    );

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
                                    lazyLoad
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
