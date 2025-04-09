import { useState, useEffect, memo, useMemo } from 'react';
import { Box, Typography, Fab, Avatar, Grid, Paper, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import QuizButton from './components/quizbutton.jsx'
import './home.css'
import Homenav from './homenav.jsx';
import {baseAxios, createCancelToken} from "../../config/axiosConfig.jsx";

// Memoize the Homenav component to prevent unnecessary re-renders
const MemoizedHomenav = memo(Homenav);

const Home = () => {
    const [homepageData, setHomepageData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        // Create a cancel token for the request outside the async function
        const cancelTokenSource = createCancelToken();
        
        const fetchHomepageData = async () => {
            setIsLoading(true);
            
            try {
                const res = await baseAxios.get('/homepage', {
                    cancelToken: cancelTokenSource.token
                });
                setHomepageData(res.data);
                setIsLoading(false);
            } catch (err) {
                if (err.response?.status === 400) {
                    setError(err.response.data);
                } else if (!axios.isCancel(err)) {
                    setError("Error fetching homepage data");
                    console.error("Error fetching homepage data:", err);
                }
                setIsLoading(false);
            }
        };
        
        fetchHomepageData();
        
        // Cleanup function to cancel request if component unmounts
        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);
    // Memoize the content to prevent unnecessary re-renders
    const homeContent = useMemo(() => {
        // Loading state
        if (isLoading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }
        
        // Error state
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
        
        // No data state
        if (!homepageData) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Typography>Không có dữ liệu</Typography>
                </Box>
            );
        }
        
        // Main content when data is loaded
        return (
            <Box className="dashboard">
                <Box className="upDivWrapperHome">
                    <Avatar
                        alt={homepageData.name}
                        src={homepageData.images[0]}
                        className="avatarHome"
                    />
                    <Typography variant="h4" color="primary">
                        Xin chào {homepageData.name}
                    </Typography>
                </Box>
                <Grid container className="gridWrapperHome">
                    <MemoizedHomenav />
                    <Grid className="columnCTAS">
                        <Typography
                            color="primary"
                            gutterBottom
                            align="center"
                            className="findMatchTitleHome"
                            style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "25px"}}
                        >
                            Tìm kiếm người hẹn hò của bạn
                        </Typography>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} className="columnPaper">
                                <Paper elevation={3} className="paperCTA" style={{borderRadius:"20px"}}>
                                    <FavoriteIcon fontSize="large" color="secondary" />
                                    <Typography variant="h4" color="primary">
                                        Gợi ý
                                    </Typography>
                                    <Typography className="paperText">
                                        Chúng tôi sẽ sử dụng các thông tin bạn cung cấp để gợi ý người hẹn hò phù hợp với bạn nhất
                                    </Typography>
                                    <Fab
                                        size="large"
                                        color="secondary"
                                        aria-label="add"
                                        href="/suggestions"
                                    >
                                        <AddIcon />
                                    </Fab>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} className="columnPaper">
                                <Paper elevation={3} className="paperCTA" style={{borderRadius:"20px"}}>
                                    <SearchIcon fontSize="large" color="secondary" />
                                    <Typography variant="h4" color="primary">
                                        Tìm kiếm
                                    </Typography>
                                    <Typography className="paperText">
                                        Bạn có thể sử dụng bộ lọc với các thông tin về sở thích, tuổi, vị trí,... để tìm người hẹn hò của bạn
                                    </Typography>
                                    <Fab
                                        size="large"
                                        color="secondary"
                                        aria-label="add"
                                        href="/search"
                                    >
                                        <AddIcon />
                                    </Fab>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <QuizButton />
            </Box>
        );
    }, [isLoading, error, homepageData]);
    
    return homeContent;
};
export default Home;

