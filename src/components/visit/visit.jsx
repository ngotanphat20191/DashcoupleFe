import {memo, useCallback, useEffect, useState} from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {Avatar, Box, Button, Chip, Grid, Paper, Stack, Typography} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import {loginSignUpAxios, matchesAxios} from "../../config/axiosConfig.jsx";

const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);

const Visit = () => {
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(null);

    const [enableCircularNav, setEnableCircularNav] = useState(true);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await loginSignUpAxios.get('/signup/interest');
                setinterests(res.data);
            } catch (err) {
                console.error("Error fetching interests:", err);
            }
        };
        const fetchData = async () => {
            try {
                await handleLike();
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };
        fetchData();
        fetchInterests();
    }, []);

    async function handleLike() {
        try {
            const response = await matchesAxios.get('/like');
            setprofile(response.data);
            console.log(response.data);
        } catch (err) {
            console.error("Error in handleLike:", err);
            if (err.response?.status === 400) {
                console.error("Bad request:", err.response.data);
            }
            setprofile([]);
        }
    }

    const handleProfileSelect = useCallback((selectedProfile) => {
        if (!profile || !Array.isArray(profile)) return;

        const index = profile.findIndex(p =>
            p.userRecord && selectedProfile.userRecord &&
            p.userRecord.User_ID === selectedProfile.userRecord.User_ID
        );

        if (index !== -1) {
            setSelectedProfileIndex(index);
        }
    }, [profile]);

    const handleBackToList = useCallback(() => {
        setSelectedProfileIndex(null);
    }, []);

    const isLoading = profile === null || interests === null;
    const hasNoData = profile !== null && (profile.length === 0 || !Array.isArray(profile));

    // Using a custom onSwipe handler that we'll pass to the ProfilesGrid component
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
            <MemoizedHomenav/>
            <MemoizedTitle textTitle="Lịch sử thích"/>

            {isLoading ? (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "50vh"}}>
                    <CircularProgress sx={{color: "#fc6ae7"}}/>
                    <Typography sx={{ml: 2, color: "#555"}}>Đang tải dữ liệu...</Typography>
                </Box>
            ) : hasNoData ? (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "50vh"}}>
                    <Typography sx={{color: "#555"}}>Không có dữ liệu người dùng đã thích</Typography>
                </Box>
            ) : selectedProfileIndex !== null ? (
                <Box sx={{width: "100%", maxWidth: "1200px", padding: "20px"}}>
                    <Button
                        variant="outlined"
                        onClick={handleBackToList}
                        sx={{
                            mb: 2,
                            color: "#bb2caa",
                            borderColor: "#fc6ae7",
                            '&:hover': {
                                borderColor: "#fc6ae7",
                                backgroundColor: "rgba(252, 106, 231, 0.1)"
                            }
                        }}
                    >
                        Quay lại danh sách
                    </Button>
                    <ProfilesGrid
                        profiles={profile}
                        type="liking"
                        interests={interests}
                        indexSkip={[]}
                        currentIndex={selectedProfileIndex}
                        enableCircularNav={enableCircularNav}
                        totalProfiles={profile.length}
                        onNavigate={handleProfileNavigation}
                    />
                </Box>
            ) : (
                <LikesList profiles={profile} onSelectProfile={handleProfileSelect}/>
            )}
        </Stack>
    );
};

const LikesList = memo(({profiles, onSelectProfile}) => {
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
        return (
            <Box sx={{textAlign: 'center', p: 3}}>
                <Typography variant="subtitle1" color="text.secondary">
                    Chưa có người dùng bạn đã thích.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%', p: 2}}>
            <Grid container spacing={2}>
                {profiles.map((profile, index) => {
                    const user = profile.userRecord;
                    if (!user) return null;

                    const mainImage = profile.images && profile.images.length > 0
                        ? profile.images[0]
                        : 'https://via.placeholder.com/150';

                    const birthDate = user.date_of_birth ? new Date(user.date_of_birth) : null;
                    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/A';

                    return (
                        <Grid item xs={12} sm={6} md={4} key={user.User_ID || index}>
                            <Paper
                                elevation={3}
                                onClick={() => onSelectProfile(profile)}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: '16px',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(252, 106, 231, 0.2)',
                                    },
                                    border: '1px solid #fc6ae740',
                                    background: 'linear-gradient(to bottom right, #fff, #ffe8fd)'
                                }}
                            >
                                <Box sx={{display: 'flex', mb: 2}}>
                                    <Avatar
                                        src={mainImage}
                                        alt={user.name || 'Profile'}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            border: '3px solid #fc6ae7',
                                            mr: 2
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" sx={{fontWeight: 'bold', mb: 0.5}}>
                                            {user.name || 'Chưa có tên'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                            {age} tuổi • {user.city || 'N/A'}
                                        </Typography>
                                        <Chip
                                            label={user.gender === 'Nu' ? 'Nữ' : user.gender}
                                            size="small"
                                            sx={{
                                                bgcolor: user.gender === 'Nu' ? '#ffb6c1' : '#add8e6',
                                                color: '#333',
                                                fontWeight: 'bold',
                                                mr: 1
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{mb: 1}}>
                                    {user.relationship && (
                                        <Chip
                                            label={user.relationship}
                                            size="small"
                                            variant="outlined"
                                            sx={{mb: 1}}
                                        />
                                    )}
                                    {user.education && (
                                        <Chip
                                            label={user.education}
                                            size="small"
                                            variant="outlined"
                                            sx={{mb: 1}}
                                        />
                                    )}
                                </Stack>

                                {user.about && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            fontSize: '0.9rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        &#34;{user.about}&#34;
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
});

export default memo(Visit);