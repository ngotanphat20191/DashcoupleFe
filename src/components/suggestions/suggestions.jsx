import React, {useEffect, useState, useCallback, useMemo, memo} from 'react';
import SuggestionsFilters from './components/suggestions-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import {Box, Stack, Typography, Button, Alert} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import { interestNames, religionNames} from '../../datas/template.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken} from "../../config/axiosConfig.jsx";

// Memoize components that don't need to re-render often
const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);
const Suggestions = () => {
    // State management with proper initialization
    const [profile, setprofile] = useState(null);
    const [preference, setpreference] = useState(null);
    const [interests, setinterests] = useState(null);
    const [indexskip, setindexskip] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Initialize turn from localStorage with proper error handling
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
                const [interestsResponse, preferenceResponse] = await Promise.all([
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    }),
                    baseAxios.get('/suggestion/preference', {
                        cancelToken: cancelTokenSource.token
                    })
                ]);
                
                // Update state with fetched data
                setinterests(interestsResponse.data);
                setpreference(preferenceResponse.data);
                
                // Fetch suggestions after getting interests and preferences
                await handleSuggestion();
                
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
    const handleSkip = useCallback((data) => {
        if (!data || !data.id) return;
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
        try {
            const cancelTokenSource = createCancelToken();
            
            const response = await baseAxios.post('/suggestion', {
                turn: turn
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            setprofile(response.data);
            
            // Check if we need to reset indexskip and turn
            if (checkTime(response.data.listCreateTime)) {
                setindexskip([]);
                setturn(0);
            }
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
    }, [turn]);

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
    const suggestionsContent = useMemo(() => {
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
                
                {profile?.userProfileMatchesEntityList?.length > 0 && interests?.length > 0 ? (
                    <ProfilesGrid
                        profiles={profile.userProfileMatchesEntityList}
                        type="suggestion"
                        indexSkip={indexskip}
                        setindexskip={setindexskip}
                        interests={interests}
                    />
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column" }}>
                        <Typography sx={{ mb: 2 }}>Không có gợi ý nào phù hợp</Typography>
                        <Button variant="contained" onClick={handleSuggestion}>
                            Tải lại gợi ý
                        </Button>
                    </Box>
                )}
            </Stack>
        );
    }, [isLoading, error, profile, preference, interests, indexskip, setindexskip, handleSuggestion]);
    
    return suggestionsContent;
};

// Export memoized component for better performance
export default memo(Suggestions);
