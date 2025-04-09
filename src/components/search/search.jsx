import React, {useEffect, useState, useCallback, memo, useMemo} from 'react';
import SuggestionsFilters from '../suggestions/components/suggestions-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import {Box, Stack, Typography, Button} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import { interestNames, religionNames} from '../../datas/template.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken} from "../../config/axiosConfig.jsx";

// Memoize components that don't need to re-render often
const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);
const Search = () => {
    const [profile, setprofile] = useState(null);
    const [preference, setpreference] = useState(null);
    const [interests, setinterests] = useState(null);
    const [indexskip, setindexskip] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Initialize turn from localStorage with memoization
    const [turn, setturn] = useState(() => {
        try {
            const storedTurn = localStorage.getItem("turn");
            return storedTurn !== null ? parseInt(storedTurn, 10) : 0;
        } catch (e) {
            console.error("Error reading from localStorage:", e);
            return 0;
        }
    });
    
    // Fetch all initial data in parallel for better performance
    useEffect(() => {
        const cancelTokenSource = createCancelToken();
        
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null); // Reset any previous errors
            
            try {
                // Initialize parameters first
                await initParemeter();
                
                // Fetch data in parallel
                const [interestsResponse, preferenceResponse, profileResponse] = await Promise.all([
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    }),
                    baseAxios.get('/suggestion/preference', {
                        cancelToken: cancelTokenSource.token
                    }),
                    baseAxios.post('/search', {}, {
                        cancelToken: cancelTokenSource.token
                    })
                ]);
                
                // Update state with fetched data
                setinterests(interestsResponse.data);
                setpreference(preferenceResponse.data);
                setprofile(profileResponse.data);
                setindexskip([]);
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    // Request was cancelled, ignore
                    return;
                }
                
                setIsLoading(false);
                setError("Error loading data. Please try again.");
                console.error("Error fetching data:", err);
            }
        };
        
        fetchAllData();
        
        return () => {
            // Cleanup function to cancel requests if component unmounts
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem("indexSuggestionSkip", JSON.stringify(indexskip));
            localStorage.setItem("turn", turn.toString());
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [])

    // Memoize handlers to prevent unnecessary recreations
    const handleLike = useCallback(async (data) => {
        const cancelTokenSource = createCancelToken();
        
        try {
            // Optimistically update UI
            setindexskip(prev => [...prev, data.id]);
            
            // Send request to server
            const response = await baseAxios.post('/like/add', {
                UserIdTarget: data.id
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            // No need to update state again as we already did it optimistically
        } catch (err) {
            if (axios.isCancel(err)) {
                // Request was cancelled, ignore
                return;
            }
            
            // Revert optimistic update on error
            setindexskip(prev => prev.filter(id => id !== data.id));
            
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                console.error("Error liking profile:", err);
                setError("Failed to like profile");
            }
        }
    }, []);
    
    // Simple handlers can be memoized too
    const handleSkip = useCallback((data) => {
        setindexskip(prev => [...prev, data.id]);
    }, []);
    
    // Initialize parameters from localStorage
    const initParemeter = useCallback(() => {
        try {
            // Initialize localStorage if needed
            if (localStorage.getItem("indexSuggestionSkip") === null) {
                localStorage.setItem("indexSuggestionSkip", JSON.stringify([]));
            }
            if (localStorage.getItem("turn") === null) {
                localStorage.setItem("turn", '0');
            }
            
            // Get values from localStorage
            setturn(parseInt(localStorage.getItem("turn") || "0", 10));
            const storedIndexes = JSON.parse(localStorage.getItem("indexSuggestionSkip")) || [];
            setindexskip(storedIndexes);
        } catch (e) {
            console.error("Error initializing parameters:", e);
            // Set defaults if localStorage fails
            setturn(0);
            setindexskip([]);
        }
    }, []);
    
    // Fetch suggestions with proper error handling
    const handleSuggestion = useCallback(async () => {
        const cancelTokenSource = createCancelToken();
        
        try {
            const response = await baseAxios.post('/search', {}, {
                cancelToken: cancelTokenSource.token
            });
            setprofile(response.data);
            setindexskip([]);
        } catch (err) {
            if (axios.isCancel(err)) {
                // Request was cancelled, ignore
                return;
            }
            
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                console.error("Error fetching suggestions:", err);
                setError("Failed to load suggestions");
            }
        }
    }, []);

    function checkTime(data) {
        const listCreateTime = new Date(data);
        const now = new Date();
        const diffMs = now - listCreateTime;
        const diffMinutes = diffMs / (1000 * 60);
        if (diffMinutes >= 0 && diffMinutes <= 5) {
            return true;
        } else {
            return false;
        }
    }
    // Memoize the content to prevent unnecessary re-renders
    const searchContent = useMemo(() => {
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
                    <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>
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
                marginLeft: "200px", 
                marginRight: "100px", 
                marginTop: "50px", 
                borderRadius: "20px", 
                backgroundColor: "#ffe8fd"
            }}>
                <MemoizedHomenav />
                <MemoizedTitle textTitle="Gợi ý" />
                
                {preference && interests && (
                    <SuggestionsFilters
                        preference={preference}
                        interestNames={interests}
                        religionNames={religionNames}
                        setpreference={setpreference}
                    />
                )}
                
                <Divider />
                
                {profile && interests && interests.length > 0 ? (
                    <ProfilesGrid
                        profiles={profile}
                        type="suggestion"
                        indexSkip={indexskip}
                        setindexskip={setindexskip}
                        interests={interests}
                    />
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <Typography>Không có dữ liệu để hiển thị</Typography>
                    </Box>
                )}
            </Stack>
        );
    }, [isLoading, error, profile, preference, interests, indexskip, setindexskip]);
    
    return searchContent;
};

export default Search;
