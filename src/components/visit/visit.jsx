import {useEffect, useState, memo} from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {Box, Stack, Typography} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import {matchesAxios, loginSignUpAxios} from "../../config/axiosConfig.jsx";

const MemoizedHomenav = memo(Homenav);
const MemoizedTitle = memo(Title);

const Visit = () => {
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);

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
        } catch (err) {
            console.error("Error in handleLike:", err);
            if (err.response?.status === 400) {
                console.error("Bad request:", err.response.data);
            }
            setprofile([]);
        }
    }

    const isLoading = profile === null || interests === null;
    const hasNoData = profile !== null && (profile.length === 0 || !Array.isArray(profile));

    return (
            <Stack style={{alignItems: "center", height: "100%", border: "2px solid #fc6ae7", width:"80%", marginLeft: "200px", marginRight:"100px", marginTop:"50px", borderRadius:"20px", backgroundColor:"#ffe8fd"}}>
                <MemoizedHomenav />
                <MemoizedTitle textTitle="Lịch sử thích" />
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#fc6ae7" }} />
                        <Typography sx={{ ml: 2, color: "#555" }}>Đang tải dữ liệu...</Typography>
                    </Box>
                ) : profile && Array.isArray(profile) && profile.length > 0 && (
                    <ProfilesGrid
                        profiles={profile}
                        type="liking"
                        interests={interests}
                    />
                )}
            </Stack>
    );
};
export default memo(Visit);
