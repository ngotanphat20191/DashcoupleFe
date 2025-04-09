import React, {useEffect, useState, useCallback, useMemo, memo} from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {Box, Stack, Typography, Button, Alert} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken} from "../../config/axiosConfig.jsx";

// Memoize components that don't need to re-render often
const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);

const Like = () => {
    // State management with proper initialization
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all initial data in parallel for better performance
    useEffect(() => {
        const cancelTokenSource = createCancelToken();
        
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null); // Reset any previous errors
            
            try {
                // Fetch data in parallel
                const [interestsResponse, likedResponse] = await Promise.all([
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    }),
                    baseAxios.get('/liked', {
                        cancelToken: cancelTokenSource.token
                    })
                ]);
                
                // Update state with fetched data
                setinterests(interestsResponse.data);
                setprofile(likedResponse.data);
                
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    // Request was cancelled, ignore
                    return;
                }
                
                setIsLoading(false);
                if (err.response?.status === 400) {
                    setError(err.response.data);
                } else {
                    setError("Error loading data. Please try again.");
                    console.error("Error fetching data:", err);
                }
            }
        };
        
        fetchAllData();
        
        return () => {
            // Cleanup function to cancel requests if component unmounts
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);
    
    // Memoize the handleLiked function to prevent unnecessary recreations
    const handleLiked = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Reset error state when retrying
        const cancelTokenSource = createCancelToken();
        
        try {
            const response = await baseAxios.get('/liked', {
                cancelToken: cancelTokenSource.token
            });
            
            setprofile(response.data);
            setIsLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) {
                // Request was cancelled, ignore
                return;
            }
            
            setIsLoading(false);
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                console.error("Error fetching liked profiles:", err);
                setError("Failed to load liked profiles");
            }
        }
    }, []);
    // Memoize the content to prevent unnecessary re-renders
    const likeContent = useMemo(() => {
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
                    <Button variant="contained" onClick={() => handleLiked()}>
                        Thử lại
                    </Button>
                </Box>
            );
        }
        
        // Main content when data is loaded
        return (
            <Stack style={{
                alignItems: "center", 
                border: "2px solid #fc6ae7", 
                width: "80%",
                height: "100%",
                marginLeft: "200px", 
                marginRight: "100px", 
                marginTop: "50px", 
                borderRadius: "20px", 
                backgroundColor: "#ffe8fd"
            }}>
                <MemoizedTitle textTitle="Cơ hội ghép đôi" />
                <MemoizedHomenav />
                
                {profile?.length > 0 && interests?.length > 0 ? (
                    <ProfilesGrid
                        profiles={profile}
                        type="like"
                        interests={interests}
                    />
                ) : (
                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column",
                        justifyContent: "center", 
                        alignItems: "center", 
                        height: "50vh",
                        width: "80%",
                        padding: "20px",
                        margin: "20px",
                        backgroundColor: "#fff5fd",
                        borderRadius: "15px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                        border: "1px solid #ffcef2"
                    }}>
                        <img 
                            src="https://media3.giphy.com/media/IuWKl0QnlgO4SkXt7b/200w.gif?cid=6c09b952xaa9j1juxa6skj0mnpavod5ctyj59unaw4lpxhlw&ep=v1_gifs_search&rid=200w.gif&ct=g"
                            alt="Empty heart" 
                            style={{ 
                                width: "100px", 
                                height: "100px", 
                                marginBottom: "20px",
                                opacity: "0.7"
                            }} 
                        />
                        <Typography 
                            sx={{ 
                                fontSize: "1.2rem", 
                                fontWeight: "bold", 
                                color: "#ff66c4",
                                textAlign: "center",
                                mb: 1
                            }}
                        >
                            Hiện tại không có đối tượng nào
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontSize: "1rem", 
                                color: "#666",
                                textAlign: "center",
                                mb: 2
                            }}
                        >
                            Hãy cố gắng tìm kiếm thêm để có cơ hội ghép đôi!
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={handleLiked}
                            sx={{
                                backgroundColor: "#fc6ae7",
                                '&:hover': {
                                    backgroundColor: "#e056c5",
                                }
                            }}
                        >
                            Tải lại
                        </Button>
                    </Box>
                )}
            </Stack>
        );
    }, [isLoading, error, profile, interests, handleLiked]);
    
    return likeContent;
};

// Export memoized component for better performance
export default memo(Like);