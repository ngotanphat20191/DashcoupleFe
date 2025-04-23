import {useEffect, useState, useCallback, useMemo, memo} from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {Box, Stack, Typography, Button, Alert} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken, matchesAxios} from "../../config/axiosConfig.jsx";

const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);

const Like = () => {
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasNoData, setHasNoData] = useState(false);

    useEffect(() => {
        const cancelTokenSource = createCancelToken();
        
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const [interestsResponse, likedResponse] = await Promise.all([
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    }),
                    matchesAxios.get('/liked', {
                        cancelToken: cancelTokenSource.token
                    })
                ]);
                
                setinterests(interestsResponse.data);
                setprofile(likedResponse.data);
                
                // Check if there are no profiles
                setHasNoData(!likedResponse.data || likedResponse.data.length === 0 || !Array.isArray(likedResponse.data));
                console.log("Like data loaded:", likedResponse.data);
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }
                
                setIsLoading(false);
                if (err.response?.status === 400) {
                    setError(err.response.data);
                } else {
                    setError("Error loading data. Please try again.");
                }
            }
        };
        
        fetchAllData();
        
        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);
    
    // Memoize the handleLiked function to prevent unnecessary recreations
    const handleLiked = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Reset error state when retrying
        const cancelTokenSource = createCancelToken();
        
        try {
            const response = await matchesAxios.get('/liked', {
                cancelToken: cancelTokenSource.token
            });
            
            setprofile(response.data);
            // Check if there are no profiles
            setHasNoData(response.data.length === 0);
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
                
                {profile && Array.isArray(profile) && profile.length > 0 ? (
                    <ProfilesGrid
                        profiles={profile}
                        type="like"
                        interests={interests}
                    />
                )}
            </Stack>
        );
    }, [isLoading, error, profile, interests, handleLiked, hasNoData]);
    
    return likeContent;
};

// Export memoized component for better performance
export default memo(Like);