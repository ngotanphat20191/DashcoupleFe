import React, {useEffect, useState, useCallback, useMemo, memo} from 'react';
import './profile.css';
import Settings from './components/Setting.jsx'
import ProfileInfo from './components/profileInfo.jsx'
import axios from 'axios';
import {loginSignUpAxios, baseAxios, createCancelToken} from "../../config/axiosConfig.jsx";
import {Box, CircularProgress, Typography, Button, Alert} from "@mui/material";

// Memoize components that don't need to re-render often
const MemoizedSettings = memo(Settings);
const MemoizedProfileInfo = memo(ProfileInfo);

const Profile = () => {
    // State management with proper initialization
    const [interests, setinterests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Initialize form data with default values
    const [formData, setFormData] = useState({
        email: "",
        matkhau: "",
        userRecord: {
            userId: "",
            age: "",
            name: "",
            about: "",
            birthday: "",
            phonenumber: "",
            gender: "",
            height: "",
            city: "",
            Job: "",
            religion: "",
            Education: "",
            relationship: "",
        },
        interest: [],
        images: [],
        imagesList: Array(6).fill(null),
        HaveSon: "",
        religion: "",
        preferenceRecord: {
            preferenceAgeMin: "",
            preferenceAgeMax: "",
            preferencePopularityMax: "",
            preferencePopularityMin: "",
            preferenceLocation: "",
        },
        preferenceInterest: [],
    });
    // Memoize the age calculation function for better performance
    const calculateAge = useCallback((dob) => {
        if (!dob) return 0;
        
        try {
            const birth = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            const dayDiff = today.getDate() - birth.getDate();
    
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }
    
            return age;
        } catch (error) {
            console.error("Error calculating age:", error);
            return 0;
        }
    }, []);
    
    // Fetch all initial data in parallel for better performance
    useEffect(() => {
        // Create the cancel token source outside the fetchAllData function
        // so it's accessible in the cleanup function
        const cancelTokenSource = createCancelToken();
        
        const fetchAllData = async () => {
            setIsLoading(true);
            
            try {
                // Fetch data in parallel
                const [profileResponse, interestsResponse] = await Promise.all([
                    baseAxios.get('/profile', {
                        cancelToken: cancelTokenSource.token
                    }),
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    })
                ]);
                
                // Process profile data
                const profileData = profileResponse.data;
                const images = profileData.images || [];
                
                // Create imagesList with the same URLs as images
                // This ensures the images are displayed in the edit view
                const imagesList = Array(6).fill(null);
                images.forEach((imageUrl, index) => {
                    if (index < 6) {
                        imagesList[index] = imageUrl;
                    }
                });
                
                // Update form data with fetched profile
                setFormData(prevState => ({
                    ...prevState,
                    ...profileData,
                    userRecord: {
                        ...prevState.userRecord,
                        ...profileData.userRecord,
                        age: calculateAge(profileData?.userRecord?.birthday),
                    },
                    preferenceRecord: {
                        ...prevState.preferenceRecord,
                        ...profileData.preferenceRecord,
                    },
                    interest: profileData.interest || [],
                    images: profileData.images || [],
                    preferenceInterest: profileData.preferenceInterest || [],
                    imagesList: imagesList, // Use our properly constructed imagesList
                }));
                
                // Update interests
                setinterests(interestsResponse.data);
                
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    // Request was cancelled, ignore
                    return;
                }
                
                setIsLoading(false);
                setError("Error loading profile data. Please try again.");
                console.error("Error fetching profile data:", err);
            }
        };
        
        fetchAllData();
        
        return () => {
            // Cleanup function to cancel requests if component unmounts
            cancelTokenSource.cancel('Component unmounted');
        };
    }, [calculateAge]);
    // Memoize the content to prevent unnecessary re-renders
    const profileContent = useMemo(() => {
        // Show loading state
        if (isLoading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }
        
        // Show error state
        if (error) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </Box>
            );
        }
        
        // Show empty state if no data
        if (!formData.images || formData.images.length === 0) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                    <Typography sx={{ mb: 2 }}>Không có dữ liệu hồ sơ</Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </Box>
            );
        }
        
        // Main content when data is loaded
        return (
            <div style={{display: 'flex'}}>
                <MemoizedSettings 
                    interests={interests} 
                    formData={formData} 
                    setFormData={setFormData} 
                />
                <MemoizedProfileInfo 
                    interests={interests} 
                    formData={formData} 
                    setFormData={setFormData} 
                />
            </div>
        );
    }, [isLoading, error, formData, interests, setFormData]);
    
    return profileContent;
};

// Export memoized component for better performance
export default memo(Profile);
