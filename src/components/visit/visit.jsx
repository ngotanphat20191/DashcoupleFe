import {useEffect, useState} from 'react';
import Title from '../shared/title.jsx';
import ProfilesGrid from '../shared/profiles-grid.jsx';
import {Box, Stack, Typography} from '@mui/material';
import Homenav from '../home/homenav.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import {matchesAxios, loginSignUpAxios} from "../../config/axiosConfig.jsx";

const Visit = () => {
    const [profile, setprofile] = useState(null);
    const [interests, setinterests] = useState(null);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await loginSignUpAxios.get('/signup/interest');
                setinterests(res.data);
            } catch (err) {
            }
        };
        const fetchData = async () => {
            try {
               await handleLike();
            } catch (error) {
            }
        };
        fetchData();
        fetchInterests()
    }, []);
    async function handleLike() {
        try {
            const response = await matchesAxios.get('/like');
            setprofile(response.data);
        } catch (err) {
            if (err.response?.status === 400) {
            }
        }
    }

    const isLoading = profile === null || interests === null;
    const hasNoData = profile !== null && profile.length === 0;

    return (
            <Stack style={{alignItems: "center", height: "100%", border: "2px solid #fc6ae7", width:"80%", marginLeft: "200px", marginRight:"100px", marginTop:"50px", borderRadius:"20px", backgroundColor:"#ffe8fd"}}>
                <Homenav></Homenav>
                <Title textTitle="Lịch sử thích" />
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#fc6ae7" }} />
                        <Typography sx={{ ml: 2, color: "#555" }}>Đang tải dữ liệu...</Typography>
                    </Box>
                ) : hasNoData ? (
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
                                textAlign: "center" 
                            }}
                        >
                            Hãy thích nhiều người hơn để xem lịch sử của bạn ở đây!
                        </Typography>
                    </Box>
                ) : (
                    <ProfilesGrid
                        profiles={profile}
                        type="liking"
                        interests={interests}
                    />
                )}
            </Stack>
    );
};
export default Visit;
