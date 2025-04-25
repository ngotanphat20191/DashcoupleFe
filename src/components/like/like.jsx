import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import Title from '../shared/title.jsx';
import {Alert, Box, Button, Grid, Stack, Typography} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {createCancelToken, loginSignUpAxios, matchesAxios} from "../../config/axiosConfig.jsx";
import CandidateList from './CandidateList.jsx';
import MediaCard from '../shared/components/media-card.jsx';

const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);
const MemoizedCandidateList = memo(CandidateList);

const Like = () => {
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasNoData, setHasNoData] = useState(false);
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
    const [mediaCardKey, setMediaCardKey] = useState(0);

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

    const handleLiked = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const cancelTokenSource = createCancelToken();

        try {
            const response = await matchesAxios.get('/liked', {
                cancelToken: cancelTokenSource.token
            });

            setprofile(response.data);
            setHasNoData(response.data.length === 0);
            setIsLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) {
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

    // Handler for selecting a profile from the candidate list
    const handleSelectCandidate = useCallback((index) => {
        setSelectedProfileIndex(index);
        // Increment the key to force a re-render of MediaCard
        setMediaCardKey(prevKey => prevKey + 1);
    }, []);

    // Handle navigation between profiles
    const handleProfileNavigation = useCallback((direction, currentIndex) => {
        if (!profile || !Array.isArray(profile) || profile.length <= 1) return;

        let newIndex;
        if (direction === "left") {
            // Going to next profile
            newIndex = (currentIndex + 1) % profile.length;
        } else if (direction === "right") {
            // Going to previous profile
            newIndex = (currentIndex - 1 + profile.length) % profile.length;
        }

        setSelectedProfileIndex(newIndex);
    }, [profile]);

    return useMemo(() => {
        if (isLoading) {
            return (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <CircularProgress/>
                    <Typography sx={{ml: 2}}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }

        // Show error state
        if (error) {
            return (
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column"
                }}>
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={() => handleLiked()}>
                        Thử lại
                    </Button>
                </Box>
            );
        }

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
                <MemoizedTitle textTitle="Cơ hội ghép đôi"/>
                <MemoizedHomenav/>

                {profile && Array.isArray(profile) && profile.length > 0 && (
                    <Box sx={{width: '100%', p: 3}}>
                        <Grid container spacing={3} sx={{minHeight: 'calc(100vh - 200px)'}}>
                            {/* Left side: Candidate List */}
                            <Grid item xs={12} sm={12} md={4} lg={4} sx={{height: '100%'}}>
                                <Typography variant="h6" sx={{mb: 1, fontWeight: 'bold', color: '#bb2caa'}}>
                                    Danh sách ứng viên
                                </Typography>
                                <Box sx={{height: 'calc(100% - 40px)'}}>
                                    <MemoizedCandidateList
                                        profiles={profile}
                                        currentIndex={selectedProfileIndex}
                                        onSelectCandidate={handleSelectCandidate}
                                    />
                                </Box>
                            </Grid>

                            {/* Right side: Media Card - Use a key to force re-render */}
                            <Grid item xs={12} sm={12} md={8} lg={8}>
                                <Typography variant="h6" sx={{mb: 1, fontWeight: 'bold', color: '#bb2caa'}}>
                                    Chi tiết ứng viên
                                </Typography>
                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <MediaCard
                                        key={mediaCardKey}
                                        profiles={profile}
                                        type="like"
                                        interests={interests}
                                        initialIndex={selectedProfileIndex}
                                        enableCircularNav={true}
                                        totalProfiles={profile.length}
                                        onNavigate={handleProfileNavigation}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Stack>
        );
    }, [isLoading, error, profile, interests, handleLiked, selectedProfileIndex, handleSelectCandidate, handleProfileNavigation, mediaCardKey]);
};

export default memo(Like);