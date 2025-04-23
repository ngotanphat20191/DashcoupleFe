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
import {loginSignUpAxios, createCancelToken, matchesAxios} from "../../config/axiosConfig.jsx";

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
    const [retryCount, setRetryCount] = useState(0);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [turn, setTurn] = useState(() => {
        try {
            const storedTurn = localStorage.getItem("turn");
            if (storedTurn === null) {
                return 1;
            }
            const parsedTurn = parseInt(storedTurn, 10);
            return isNaN(parsedTurn) ? 1 : parsedTurn;
        } catch (e) {
            console.error("Error reading from localStorage:", e);
            return 1;
        }
    });

    useEffect(() => {
        console.log("Initial useEffect running");
        const cancelTokenSource = createCancelToken();
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log("Initializing parameters");
                await initParemeter();

                console.log("Fetching interests and preferences");
                const [interestsResponse, preferenceResponse] = await Promise.all([
                    loginSignUpAxios.get('/signup/interest', {
                        cancelToken: cancelTokenSource.token
                    }),
                    matchesAxios.get('/suggestion/preference', {
                        cancelToken: cancelTokenSource.token
                    })
                ]);

                console.log("Setting interests and preferences");
                setinterests(interestsResponse.data);
                setpreference(preferenceResponse.data);

                console.log("Calling handleSuggestion");
                await handleSuggestion();

                if (!isFirstRender) {
                    setIsLoading(false);
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request was cancelled during initial load");
                    return;
                }

                console.error("Error in fetchAllData:", err);
                
                if (!isFirstRender || retryCount >= 2) {
                    setIsLoading(false);
                    setError("Error loading data. Please try again.");
                }
            }
        };

        fetchAllData();

        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, [handleSuggestion, initParemeter, isFirstRender, retryCount]);
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem("indexSuggestionSkip", JSON.stringify(indexskip));
            localStorage.setItem("turn", turn.toString());
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [indexskip, turn])
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
                localStorage.setItem("turn", '1');
            }

            setTurn(parseInt(localStorage.getItem("turn") || "1", 10));
            const storedIndexes = JSON.parse(localStorage.getItem("indexSuggestionSkip")) || [];
            setindexskip(storedIndexes);
        } catch (err) {
            setTurn(1);
            setindexskip([]);
        }
    }, []);
    
    // Define checkTime function before it's used in handleSuggestion
    const checkTime = useCallback((data) => {
        const listCreateTime = new Date(data);
        const now = new Date();
        const diffMs = now - listCreateTime;
        const diffMinutes = diffMs / (1000 * 60);
        if (diffMinutes >= 0 && diffMinutes <= 1) {
            return true;
        } else {
            return false;
        }
    }, []);
    
    const handleSuggestion = useCallback(async () => {
        try {
            console.log("handleSuggestion called, isFirstRender:", isFirstRender, "retryCount:", retryCount);
            const cancelTokenSource = createCancelToken();

            const response = await matchesAxios.post('/suggestion', {
                turn: turn
            }, {
                cancelToken: cancelTokenSource.token
            });

            const profileData = response.data;
            console.log("Response data received:", profileData);

            if (!profileData || !profileData.userProfileMatchesEntityList || !Array.isArray(profileData.userProfileMatchesEntityList)) {
                console.error("Invalid data structure received:", profileData);
                
                if (isFirstRender && retryCount < 2) {
                    console.log(`First render retry ${retryCount + 1}`);
                    setRetryCount(prev => prev + 1);
                    
                    setTimeout(() => {
                        handleSuggestion();
                    }, 1500);
                    return;
                }
                
                setError("Dữ liệu không hợp lệ. Vui lòng thử lại sau.");
                setIsLoading(false);
                return;
            }

            // If we get here, we have valid data
            setIsFirstRender(false);
            setprofile(profileData);
            setFilteredProfiles(profileData);

            if (checkTime(profileData.listCreateTime)) {
                setindexskip([]);
                setTurn(1);
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Request was cancelled");
                return;
            }

            console.error("Error in handleSuggestion:", err);
            
            // If this is the first render, retry automatically after a delay
            if (isFirstRender && retryCount < 2) {
                console.log(`First render retry ${retryCount + 1} after error`);
                setRetryCount(prev => prev + 1);
                
                // Wait a moment before retrying
                setTimeout(() => {
                    handleSuggestion();
                }, 1500);
                return;
            }

            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                setError("Failed to load suggestions");
            }
            setIsLoading(false);
        }
    }, [turn, isFirstRender, retryCount, checkTime]);

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
    useEffect(() => {
        if (!profile || !preference) return;


        if (!profile.userProfileMatchesEntityList || !Array.isArray(profile.userProfileMatchesEntityList)) {
            console.error("Profile data doesn't have valid userProfileMatchesEntityList property:", profile);
            return;
        }

        if (profile.userProfileMatchesEntityList.length === 0) {
            console.log("No profiles to filter - empty list");
            return;
        }

        // First filter out profiles that are in the indexskip array
        let filteredList = [...profile.userProfileMatchesEntityList].filter(item =>
            !indexskip.includes(item.userRecord.User_ID)
        );
        console.log("After skipping disliked profiles:", filteredList);

        if (preference.preferenceRecord) {
            const minAge = preference.preferenceRecord.preferenceAgeMin || 18;
            const maxAge = preference.preferenceRecord.preferenceAgeMax || 60;

            filteredList = filteredList.filter(item => {
                const age = calculateAge(item.userRecord.date_of_birth);
                return age >= minAge && age <= maxAge;
            });
            console.log("After age filter:", filteredList);
        }

        if (preference.preferenceInterest && preference.preferenceInterest.length > 0) {
            filteredList = filteredList.filter(item => {
                if (!item.interest || item.interest.length === 0) return false;

                return item.interest.some(interestId =>
                    preference.preferenceInterest.includes(interestId)
                );
            });
            console.log("After interest filter:", filteredList);
        }

        if (preference.preferenceRecord && preference.preferenceRecord.preferenceLocation) {
            const selectedReligion = preference.preferenceRecord.preferenceLocation;
            if (selectedReligion) {
                filteredList = filteredList.filter(item =>
                    item.userRecord.religion === selectedReligion
                );
                console.log("After religion filter:", filteredList);
            }
        }

        if (preference.preferenceRecord && preference.preferenceRecord.preferenceCity) {
            const selectedCity = preference.preferenceRecord.preferenceCity;
            if (selectedCity) {
                filteredList = filteredList.filter(item =>
                    item.userRecord.city === selectedCity
                );
                console.log("After city filter:", filteredList);
            }
        }

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
                    break;
            }
            console.log("After sorting:", filteredList);
        }

        setFilteredProfiles({...profile, userProfileMatchesEntityList: filteredList});
        console.log("Updated filtered profiles:", {...profile, userProfileMatchesEntityList: filteredList});
    }, [profile, preference, selectedSort, calculateAge, indexskip]);

    const handleSortChange = useCallback((sortValue) => {
        setSelectedSort(sortValue);
    }, []);
    
    const handleRetry = useCallback(() => {
        console.log("Manual retry initiated");
        setIsLoading(true);
        setError(null);
        setRetryCount(0);
        setIsFirstRender(false); // Don't treat this as first render anymore
        
        // Small delay before retrying
        setTimeout(() => {
            handleSuggestion();
        }, 500);
    }, [handleSuggestion]);

    const suggestionsContent = useMemo(() => {
        if (isLoading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant="contained" 
                            onClick={handleRetry}
                        >
                            Thử lại
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => window.location.reload()}
                        >
                            Tải lại trang
                        </Button>
                    </Stack>
                </Box>
            );
        }

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
    }, [isLoading, error, filteredProfiles, profile, preference, interests, indexskip, setindexskip, handleSuggestion, handleSortChange, handleRetry]);

    return suggestionsContent;
};

// Export memoized component for better performance
export default memo(Suggestions);
