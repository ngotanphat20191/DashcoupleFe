import {useEffect, useState, useCallback, memo, useMemo} from 'react';
import SuggestionsFilters from '../suggestions/components/suggestions-filters.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import Title from '../shared/title.jsx';
import Divider from '@mui/material/Divider';
import {Box, Stack, Typography, Button} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import {religionNames} from '../../datas/template.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {baseAxios, loginSignUpAxios, createCancelToken} from "../../config/axiosConfig.jsx";

// Memoize components that don't need to re-render often
const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);
const Search = () => {
    const [profile, setprofile] = useState(null);
    const [filteredProfiles, setFilteredProfiles] = useState(null);
    const [preference, setpreference] = useState(null);
    const [interests, setinterests] = useState(null);
    const [indexskip, setindexskip] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSort, setSelectedSort] = useState('ageAsc');
    
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
                
                const interests = interestsResponse.data;
                const preference = preferenceResponse.data;
                const profileData = profileResponse.data;
                
                if (!profileData || !Array.isArray(profileData)) {
                    console.error("Invalid profile data structure:", profileData);
                    setError("Dữ liệu không hợp lệ. Vui lòng thử lại sau.");
                    setIsLoading(false);
                    return;
                }
                setinterests(interests);
                setpreference(preference);
                setprofile(profileData);
                setFilteredProfiles(profileData);
                setindexskip([]);
                setIsLoading(false);
                
            } catch (err) {
                if (axios.isCancel(err)) {
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
    }, [indexskip, turn]);

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


        // Check if profile is an array
        if (!Array.isArray(profile)) {
            console.error("Profile data is not an array:", profile);
            return;
        }

        // If the list is empty, don't proceed with filtering
        if (profile.length === 0) {
            console.log("No profiles to filter - empty list");
            return;
        }

        // Create a copy of the original profiles
        let filteredList = [...profile];

        // Filter by age range if preference is available
        if (preference.preferenceRecord) {
            const minAge = preference.preferenceRecord.preferenceAgeMin || 18;
            const maxAge = preference.preferenceRecord.preferenceAgeMax || 60;
            
            filteredList = filteredList.filter(item => {
                const age = calculateAge(item.userRecord.date_of_birth);
                return age >= minAge && age <= maxAge;
            });
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
        }

        // Filter by religion if selected
        if (preference.preferenceRecord && preference.preferenceRecord.preferenceLocation) {
            const selectedReligion = preference.preferenceRecord.preferenceLocation;
            if (selectedReligion) {
                filteredList = filteredList.filter(item => 
                    item.userRecord.religion === selectedReligion
                );
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
        setFilteredProfiles(filteredList);
    }, [profile, preference, selectedSort, calculateAge]);

    // Handle sort change from SuggestionsFilters
    const handleSortChange = useCallback((sortValue) => {
        setSelectedSort(sortValue);
    }, []);

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
                <MemoizedTitle textTitle="Tìm kiếm" />
                
                <Box sx={{ width: '100%', padding: '10px 20px 0' }}>
                    <Typography variant="h6" fontWeight="bold" color="#555">
                        Bộ lọc tìm kiếm
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
                    console.log("Render check:", filteredProfiles, interests);
                    
                    // Check if we have valid data to display
                    if (!filteredProfiles || !Array.isArray(filteredProfiles) || 
                        filteredProfiles.length === 0 || 
                        !interests || !Array.isArray(interests)) {
                        
                        return (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column" }}>
                                <Typography variant="h6" color="#555" sx={{ mb: 2 }}>
                                    {filteredProfiles && Array.isArray(filteredProfiles) && filteredProfiles.length === 0 
                                        ? "Không có dữ liệu phù hợp với bộ lọc" 
                                        : "Không có dữ liệu từ máy chủ. Vui lòng thử lại sau."}
                                </Typography>
                                {filteredProfiles && Array.isArray(filteredProfiles) && filteredProfiles.length === 0 ? (
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
                                        onClick={() => window.location.reload()}
                                        sx={{
                                            backgroundColor: '#fc6ae7',
                                            '&:hover': {
                                                backgroundColor: '#d44bbe',
                                            }
                                        }}
                                    >
                                        Tải lại dữ liệu
                                    </Button>
                                )}
                            </Box>
                        );
                    }
                    
                    // We have valid data, show the profiles
                    return (
                        <>
                            <Box sx={{ width: '100%', padding: '10px 20px' }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="#555">
                                    Hiển thị {filteredProfiles.length} kết quả phù hợp
                                </Typography>
                            </Box>
                            <ProfilesGrid
                                profiles={filteredProfiles}
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
    }, [isLoading, error, filteredProfiles, preference, interests, indexskip, setindexskip, handleSortChange]);
    
    return searchContent;
};

export default Search;
