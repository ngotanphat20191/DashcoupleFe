import React, { useState, useRef } from 'react';
import { Button, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { IMGUR_CLIENT_ID } from "../../../config/firebaseConfig.jsx";

const ChatImageUploader = ({ onImageUploaded, disabled }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show preview dialog
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
        setShowPreview(true);
    };

    // Handle image upload to ImgBB
    const uploadImage = async (file) => {
        setIsUploading(true);
        try {
            const imageData = new FormData();
            imageData.append("image", file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGUR_CLIENT_ID}`, {
                method: "POST",
                body: imageData,
            });

            const data = await response.json();

            if (data.success) {
                // Call the callback with the image URL
                onImageUploaded(data.data.url);
                return data.data.url;
            } else {
                console.error("ImgBB Response Error:", data);
                alert("Error uploading image to ImgBB.");
                return null;
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image.");
            return null;
        } finally {
            setIsUploading(false);
            setShowPreview(false);
            // Clean up the object URL to prevent memory leaks
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        }
    };

    // Handle clicking the upload button
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Handle confirming the upload
    const handleConfirmUpload = async () => {
        // Get the file from the input
        const file = fileInputRef.current.files[0];
        if (!file) return;

        await uploadImage(file);

        // Reset the file input
        fileInputRef.current.value = "";
    };

    // Handle canceling the upload
    const handleCancelUpload = () => {
        setShowPreview(false);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={handleFileSelect}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleUploadClick}
                disabled={disabled || isUploading}
                sx={{
                    color: 'white',
                }}
            >
                {isUploading ? <CircularProgress size={24}/> : <ImageIcon/>}
            </Button>

            <Dialog open={showPreview} onClose={handleCancelUpload} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Gửi ảnh này?
                    <IconButton
                        aria-label="close"
                        onClick={handleCancelUpload}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                                width: '100%',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelUpload} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmUpload}
                        color="primary"
                        variant="contained"
                        disabled={isUploading}
                        sx={{
                            backgroundColor: '#fc6ae7',
                            '&:hover': {
                                backgroundColor: '#e056c5'
                            }
                        }}
                    >
                        {isUploading ? <CircularProgress size={24}/> : "Gửi"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default ChatImageUploader;
