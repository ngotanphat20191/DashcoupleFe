import {useEffect, useState, useCallback, useMemo, memo} from 'react';
import SuggestionsFilters from './components/suggestions-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import {Box, Stack, Typography, Button, Alert} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import {religionNames} from '../../datas/template.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken, matchesAxios} from "../../config/axiosConfig.jsx";
import _ from 'lodash';

const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);
const Suggestions = () => {
    const [profile, setprofile] = useState(null);
    const [filteredProfiles, setFilteredProfiles] = useState(null);
    const [preference, setpreference] = useState(null);
    const [interests, setinterests] = useState(null);
    const [indexskip, setindexskip] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSort, setSelectedSort] = useState('ageAsc');
    const [turn, setturn] = useState(() => {
        try {
            const storedTurn = localStorage.getItem("turn");
            return storedTurn !== null ? parseInt(storedTurn, 10) : 0;
        } catch (e) {
            return 0;
        }
    });
    
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
                    matchesAxios.get('/suggestion/preference', {
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
                    return;
                }
                
                setIsLoading(false);
                setError("Error loading data. Please try again.");
            }
        };
        
        fetchAllData();
        
        return () => {
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
    
    const initParemeter = useCallback(() => {
        try {
            if (localStorage.getItem("indexSuggestionSkip") === null) {
                localStorage.setItem("indexSuggestionSkip", JSON.stringify([]));
            }
            if (localStorage.getItem("turn") === null) {
                localStorage.setItem("turn", '0');
            }
            
            setturn(parseInt(localStorage.getItem("turn") || "0", 10));
            const storedIndexes = JSON.parse(localStorage.getItem("indexSuggestionSkip")) || [];
            setindexskip(storedIndexes);
        } catch (e) {
            setturn(0);
            setindexskip([]);
        }
    }, []);
    const handleSuggestion = useCallback(async () => {
        try {
            const cancelTokenSource = createCancelToken();
            
            const response = await matchesAxios.post('/suggestion', {
                turn: turn
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            const profileData = response.data;
            
            if (!profileData || !profileData.userProfileMatchesEntityList || !Array.isArray(profileData.userProfileMatchesEntityList)) {
                setError("Dữ liệu không hợp lệ. Vui lòng thử lại sau.");
                setIsLoading(false);
                return;
            }
            
            setprofile(profileData);
            setFilteredProfiles(profileData);
            
            // Check if we need to reset indexskip and turn
            if (checkTime(profileData.listCreateTime)) {
                setindexskip([]);
                setturn(0);
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                return;
            }
            
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
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
    
    // Calculate age from date of birth
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
    // Filter and sort profiles based on preference
    useEffect(() => {
        if (!profile || !preference) return;

        console.log("Profile data:", profile);
        console.log("Preference data:", preference);

        // Check if profile has the expected structure
        if (!profile.userProfileMatchesEntityList || !Array.isArray(profile.userProfileMatchesEntityList)) {
            console.error("Profile data doesn't have valid userProfileMatchesEntityList property:", profile);
            return;
        }

        // If the list is empty, don't proceed with filtering
        if (profile.userProfileMatchesEntityList.length === 0) {
            console.log("No profiles to filter - empty list");
            return;
        }

        // Create a copy of the original profiles
        let filteredList = [...profile.userProfileMatchesEntityList];
        console.log("Initial filtered list:", filteredList);

        // Filter by age range if preference is available
        if (preference.preferenceRecord) {
            const minAge = preference.preferenceRecord.preferenceAgeMin || 18;
            const maxAge = preference.preferenceRecord.preferenceAgeMax || 60;
            
            filteredList = filteredList.filter(item => {
                const age = calculateAge(item.userRecord.date_of_birth);
                return age >= minAge && age <= maxAge;
            });
            console.log("After age filter:", filteredList);
        }

        // Filter by interests if preference interests are selected
        if (preference.preferenceInterest && preference.preferenceInterest.length > 0) {
            filteredList = filteredList.filter(item => {
                // If the profile has no interests, filter it out when interests are selected
                if (!item.interest || item.interest.length === 0) return false;
                
                // Check if any of the profile's interests match the selected interests
                return item.interest.some(interestId => 
                    preference.preferenceInterest.includes(interestId)
                );
            });
            console.log("After interest filter:", filteredList);
        }

        // Filter by religion if selected
        if (preference.preferenceRecord && preference.preferenceRecord.preferenceLocation) {
            const selectedReligion = preference.preferenceRecord.preferenceLocation;
            if (selectedReligion) {
                filteredList = filteredList.filter(item => 
                    item.userRecord.religion === selectedReligion
                );
                console.log("After religion filter:", filteredList);
            }
        }

        // Sort profiles based on selected sort option
        if (selectedSort) {
            switch (selectedSort) {
                case 'ageAsc':
                    filteredList.sort((a, b) => 
                        calculateAge(a.userRecord.date_of_birth) - calculateAge(b.userRecord.date_of_birth)
                    );
                    break;
                case 'ageDesc':
                    filteredList.sort((a, b) => 
                        calculateAge(b.userRecord.date_of_birth) - calculateAge(a.userRecord.date_of_birth)
                    );
                    break;
                case 'alphabet':
                    filteredList.sort((a, b) => 
                        a.userRecord.name.localeCompare(b.userRecord.name)
                    );
                    break;
                default:
                    // Default sorting (no sorting)
                    break;
            }
            console.log("After sorting:", filteredList);
        }

        // Update filtered profiles
        setFilteredProfiles({...profile, userProfileMatchesEntityList: filteredList});
        console.log("Updated filtered profiles:", {...profile, userProfileMatchesEntityList: filteredList});
    }, [profile, preference, selectedSort, calculateAge]);

    // Handle sort change from SuggestionsFilters
    const handleSortChange = useCallback((sortValue) => {
        setSelectedSort(sortValue);
    }, []);
    
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
                marginTop: "50px",
                marginLeft: "200px", 
                marginRight: "100px", 
                borderRadius: "20px",
                backgroundColor: "#ffe8fd"
            }}>
                <MemoizedHomenav />
                <MemoizedTitle textTitle="Gợi ý" />
                
                <Box sx={{ width: '100%' ,  padding: '10px 20px 0' }}>
                    <Typography variant="h6" fontWeight="bold" color="#555">
                        Bộ lọc gợi ý
                    </Typography>
                </Box>
                
                {preference && interests && (
                    <SuggestionsFilters
                        preference={preference}
                        interestNames={interests}
                        religionNames={religionNames}
                        setpreference={setpreference}
                        onSortChange={handleSortChange}
                    />
                )}
                
                <Divider />
                {(() => {
                    if (!filteredProfiles || !filteredProfiles.userProfileMatchesEntityList ||
                        !Array.isArray(filteredProfiles.userProfileMatchesEntityList) || 
                        filteredProfiles.userProfileMatchesEntityList.length === 0 || 
                        !interests || !Array.isArray(interests)) {
                        
                        return (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column" }}>
                                <Typography variant="h6" color="#555" sx={{ mb: 2 }}>
                                    {filteredProfiles && filteredProfiles.userProfileMatchesEntityList && 
                                     filteredProfiles.userProfileMatchesEntityList.length === 0 
                                        ? "Không có gợi ý nào phù hợp với bộ lọc" 
                                        : "Không có gợi ý nào. Vui lòng thử lại sau."}
                                </Typography>
                                {filteredProfiles && filteredProfiles.userProfileMatchesEntityList && 
                                 filteredProfiles.userProfileMatchesEntityList.length === 0 ? (
                                    <Button 
                                        variant="contained" 
                                        onClick={() => {
                                            // Reset filters to default
                                            if (preference) {
                                                const resetPreference = {
                                                    ...preference,
                                                    preferenceInterest: [],
                                                    preferenceRecord: {
                                                        ...preference.preferenceRecord,
                                                        preferenceAgeMin: 18,
                                                        preferenceAgeMax: 60,
                                                        preferenceLocation: null
                                                    }
                                                };
                                                setpreference(resetPreference);
                                            }
                                        }}
                                        sx={{
                                            backgroundColor: '#fc6ae7',
                                            '&:hover': {
                                                backgroundColor: '#d44bbe',
                                            }
                                        }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        onClick={handleSuggestion}
                                        sx={{
                                            backgroundColor: '#fc6ae7',
                                            '&:hover': {
                                                backgroundColor: '#d44bbe',
                                            }
                                        }}
                                    >
                                        Tải lại gợi ý
                                    </Button>
                                )}
                            </Box>
                        );
                    }
                    return (
                        <>
                            <Box sx={{ width: '100%', padding: '10px 20px' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="#555">
                                    Hiển thị {filteredProfiles.userProfileMatchesEntityList.length} kết quả phù hợp
                                </Typography>
                            </Box>
                            <ProfilesGrid
                                profiles={filteredProfiles.userProfileMatchesEntityList}
                                type="suggestion"
                                indexSkip={indexskip}
                                setindexskip={setindexskip}
                                interests={interests}
                            />
                        </>
                    );
                })()}
            </Stack>
        );
    }, [isLoading, error, filteredProfiles, profile, preference, interests, indexskip, setindexskip, handleSuggestion, handleSortChange]);
    
    return suggestionsContent;
};

// Export memoized component for better performance
export default memo(Suggestions);
