import React, {useRef, useState} from "react";
import "../profile.css";
import EditImage from '../../signup/components/editImage.jsx'
import Typography from '@mui/material/Typography';
import ProfileInterest from './profileInterest.jsx'
import ProfilePerInfo from './profilePerInfo.jsx'
import MediaCard from '../../shared/components/media-card.jsx'
import {IMGUR_CLIENT_ID} from "../../../config/firebaseConfig.jsx";
import {baseAxios} from "../../../config/axiosConfig.jsx";

const ProfileInfo = ({ interests, formData, setFormData }) => {
    const containerRef = useRef(null);
    const [viewStatus, setViewStatus] = useState(1);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsUploading(true);

            // Filter out null values and process only File objects
            const filesToUpload = formData.images.filter(img => img instanceof File);

            // Upload each file to ImgBB
            const uploadPromises = filesToUpload.map(async (image, index) => {
                const imageData = new FormData();
                imageData.append("image", image);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGUR_CLIENT_ID}`, {
                    method: "POST",
                    body: imageData,
                });
                const data = await response.json();

                if (data.success) {
                    return {
                        index,
                        url: data.data.url
                    };
                } else {
                    console.error("ImgBB Response Error:", data);
                    return {
                        index,
                        url: null
                    };
                }
            });

            // Wait for all uploads to complete
            const uploadResults = await Promise.all(uploadPromises);

            // Create a new images array with uploaded URLs
            const newImages = [...formData.images];

            // Replace File objects with URLs from ImgBB
            uploadResults.forEach(result => {
                if (result.url) {
                    // Find the index in the original array
                    const originalIndex = formData.images.indexOf(filesToUpload[result.index]);
                    if (originalIndex !== -1) {
                        newImages[originalIndex] = result.url;
                    }
                }
            });

            // Update formData with new images array containing URLs
            setFormData(prevData => ({
                ...prevData,
                images: newImages,
            }));

            // Send updated profile info to backend
            await sendEditProfileRequest(newImages);
            setIsUploading(false);

        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Error uploading images.");
            setIsUploading(false);
        }
    }

    function sendEditProfileRequest(uploadedImages) {
        const updatedFormData = {
            ...formData,
            images: uploadedImages || formData.images
        };

        console.log("Sending profile update:", updatedFormData);

        return baseAxios.post('/profile', {
            token: localStorage.getItem('token'),
            about: formData.userRecord.about,
            name: formData.userRecord.name,
            birthday: formData.userRecord.birthday,
            gender: formData.userRecord.gender,
            height: formData.userRecord.height,
            city: formData.userRecord.city,
            Job: formData.userRecord.Job,
            religion: formData.userRecord.religion,
            Haveson: "",
            phonenumber: "",
            Education: formData.userRecord.education,
            relationship: formData.userRecord.relationship,
            images: uploadedImages || formData.images,
            interests: formData.interest,
        }).then((res) => {
            console.log(res.data)
            setViewStatus(1);
        }).catch(err => {
            console.log(err)
        });
    }

    return (
        <div style={{flexGrow: 1}}>
            <div className="headerButton">
                <button className="previewButton" style={{ color: viewStatus === 1 ? "rgb(234,52,79)": "black"}} onClick={() => setViewStatus(1)}>Preview</button>
                <button className="editButton" style={{ color: viewStatus === 2 ? "rgb(234,52,79)": "black"}}  onClick={() => setViewStatus(2)}>Edit</button>
            </div>
            {viewStatus === 2 ? (
                <div className="edit-profile" ref={containerRef}>
                    <Typography sx={{ fontWeight: "bold", fontSize:"18px", padding:"10px 0px"}}>Ảnh đại diện</Typography>
                    <EditImage formData={formData} setFormData={setFormData}></EditImage>
                    <ProfilePerInfo containerRef={containerRef} formData={formData} setFormData={setFormData}></ProfilePerInfo>
                    <ProfileInterest interests={interests} containerRef={containerRef} formData={formData} setFormData={setFormData}></ProfileInterest>
                    <button className="save" onClick={handleSubmit} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Save"}
                    </button>
                </div>
            ) : (
                <div>
                    <MediaCard
                        profiles={formData}
                        type="preview"
                        index='0'
                        interests={interests}
                    />
                </div>
            )
            }
        </div>
    );
};

export default ProfileInfo;