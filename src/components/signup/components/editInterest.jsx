import React, {useEffect, useState} from "react";
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import {loginSignUpAxios} from "../../../config/axiosConfig.jsx";
import {IMGUR_CLIENT_ID} from '../../../config/firebaseConfig.jsx';
const EditInterest = ({ formData, setFormData }) => {
    const [value, setValue] = React.useState([]);
    const [interests, setinterests] = React.useState(null);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const handleSubmit = async () => {
        try {
            const uploadedImages = await Promise.all(
                formData.images.map(async (image) => {
                    if(image) {
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
                            alert("Upload failed! Check console for details.");
                            return null;
                        }
                    }
                })
            );

            const validImages = uploadedImages.filter((url) => url !== null);

            setFormData((prevData) => ({
                ...prevData,
                images: validImages,
            }));
            console.log("Updated formData with images:", validImages);
            sendEditProfileRequest(formData)
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Error uploading images.");
        }
    }
    function sendEditProfileRequest(data) {
        loginSignUpAxios.post('/signup/detail', {
            token: localStorage.getItem('token'),
            name: data.name,
            about: data.about,
            birthday: data.birthday,
            phonenumber: "",
            gender: data.gender,
            height: data.height,
            city: data.city,
            Job: data.Job,
            Education: data.Education,
            HaveSon: "",
            relationship: data.relationship,
            images: data.images,
            interests: data.interest,
            religion: data.religion
        }).then((res) => {
            console.log(res.data)
            alert(res.data)
            window.location.href = '/'
        }).catch(err => {
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await loginSignUpAxios.get('/signup/interest');
                console.log(res.data)
                if (res.data && res.data.length > 0) {
                    setinterests(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchInterests();
    }, []);
    return(
        <div>
            <Typography  sx={{
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "2rem",
                fontSize: "15px",
                paddingBottom:"10px"
            }}>Hãy chọn 5 sở thích mà bạn nghĩ là bạn có, điều này giúp tăng khả năng ghép đôi phù hợp</Typography>
            <Sheet variant="outlined" sx={{ width: 360, p: 2, borderRadius: 'sm' }}>
                <div role="group" aria-labelledby="rank">
                    <List
                        orientation="horizontal"
                        wrap
                        sx={{
                            '--List-gap': '8px',
                            '--ListItem-radius': '20px',
                            '--ListItem-minHeight': '32px',
                            '--ListItem-gap': '4px',
                        }}
                    >
                        {interests && interests.map((item) => (
                            <ListItem key={item.InterestID}>
                                {value.includes(item.InterestID) && (
                                    <Done
                                        fontSize="md"
                                        color="primary"
                                        sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                    />
                                )}
                                <Checkbox
                                    size="sm"
                                    disableIcon
                                    overlay
                                    label={item.name}
                                    checked={formData.interest.includes(item.InterestID)}
                                    variant={formData.interest.includes(item.InterestID) ? 'soft' : 'outlined'}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            if (
                                                formData.interest.filter((interest) => interest !== null).length >= 5
                                            ) {
                                                alert("You can only select up to 5 interests!");
                                                return;
                                            }
                                            setValue((val) => [...val, item.InterestID]);
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                interest: [...prevData.interest, item.InterestID],
                                            }));
                                        } else {
                                            setValue((val) =>
                                                val.filter((id) => id !== item.InterestID)
                                            );
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                interest: prevData.interest.filter(
                                                    (id) => id !== item.InterestID
                                                ),
                                            }));
                                        }
                                    }}
                                    slotProps={{
                                        action: ({ checked }) => ({
                                            sx: checked
                                                ? {
                                                    border: '1px solid',
                                                    borderColor: 'primary.500',
                                                }
                                                : {},
                                        }),
                                    }}
                                />
                            </ListItem>
                        ))
                        }
                    </List>
                </div>
            </Sheet>
            <button className="save" onClick={handleSubmit} style={{marginLeft: "40%", marginTop: "5px"}}>Save</button>
        </div>
    )
}
export default EditInterest;
