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
    const handleSubmit = async () => {
        try {
            const uploadedImages = await Promise.all(
                // eslint-disable-next-line react/prop-types
                formData.images.map(async (image) => {
                    if(image instanceof File) {
                        const imageData = new FormData();
                        imageData.append("image", image);

                        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGUR_CLIENT_ID}`, {
                            method: "POST",
                            body: imageData,
                        });
                        const data = await response.json();

                        if (data.success) {
                            return data.data.url;
                        } else {
                            console.error("ImgBB Response Error:", data);
                            return null;
                        }
                    }
                    else return image;
                })
            );

            const validImages = uploadedImages.filter((url) => url !== null);

            setFormData((prevData) => ({
                ...prevData,
                images: validImages,
            }));
            sendEditProfileRequest(formData)
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Error uploading images.");
        }
    }
    function sendEditProfileRequest() {
        baseAxios.post('/profile', {
            token: localStorage.getItem('token'),
            about: formData.userRecord.about,
            name: formData.userRecord.name,
            birthday: formData.userRecord.birthday,
            gender: formData.userRecord.gender,
            height: formData.userRecord.height,
            city: formData.userRecord.city,
            Job: formData.userRecord.Job,
            Haveson: "",
            phonenumber: "",
            Education: formData.userRecord.Education,
            relationship: formData.userRecord.relationship,
            images: formData.images,
            interests: formData.interest,
        }).then((res) => {
            console.log(res.data)
            alert(res.data)
        }).catch(err => {
            console.log(err)
            alert(err.response.data)
        })
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
                    <button className="save" onClick={handleSubmit}>Save</button>
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
