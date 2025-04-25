import {memo, useEffect, useMemo, useState} from 'react';
import {Avatar, Box, Button, CircularProgress, Fab, Grid, Paper, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import QuizButton from './components/quizbutton.jsx'
import './home.css'
import Homenav from './homenav.jsx';
import {baseAxios, createCancelToken} from "../../config/axiosConfig.jsx";
import Container from "@mui/material/Container";

const MemoizedHomenav = memo(Homenav);

const Home = () => {
    const [homepageData, setHomepageData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);

    return useMemo(() => {
        if (isLoading) {
            return (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <CircularProgress/>
                    <Typography sx={{ml: 2}}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column"
                }}>
                    <Typography color="error" variant="h6" sx={{mb: 2}}>
                        {error}
                    </Typography>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </Box>
            );
        }

        if (!homepageData) {
            return (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Typography>Không có dữ liệu</Typography>
                </Box>
            );
        }
        return (
            <Box className="dashboard">
                <Container maxWidth="lg" sx={{ padding: 0 }}>
                    <Box className="upDivWrapperHome">
                        <Avatar
                            alt={homepageData?.name}
                            src={homepageData?.images[0]}
                            className="avatarHome"
                        />
                        <Typography variant="h4" sx={{
                            color: '#d81b98',
                            fontWeight: 'bold',
                            fontSize: {xs: 30, md: 40},
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            Xin chào, {homepageData?.name || "Name"}
                        </Typography>
                    </Box>

                    <Grid container className="gridWrapperHome">
                        <MemoizedHomenav/>
                        <Grid item xs={12} className="columnCTAS">
                            <Typography
                                variant="h5"
                                className="findMatchTitleHome"
                            >
                                Tìm kiếm người hẹn hò của bạn
                            </Typography>

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6} className="columnPaper">
                                    <Paper elevation={0} className="paperCTA">
                                        <FavoriteIcon fontSize="large" sx={{ color: '#ff4081', fontSize: 40, mb: 1 }} />
                                        <Typography variant="h5" sx={{ color: '#d81b98', fontWeight: 600, mb: 1 }}>
                                            Gợi ý
                                        </Typography>
                                        <Typography className="paperText">
                                            Chúng tôi sẽ sử dụng các thông tin bạn cung cấp để gợi ý người hẹn hò phù hợp
                                            với bạn nhất
                                        </Typography>
                                        <Fab
                                            size="large"
                                            sx={{
                                                bgcolor: '#ff4081',
                                                '&:hover': { bgcolor: '#d81b98' }
                                            }}
                                            aria-label="add"
                                            href="/suggestions"
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6} className="columnPaper">
                                    <Paper elevation={0} className="paperCTA">
                                        <SearchIcon fontSize="large" sx={{ color: '#ff4081', fontSize: 40, mb: 1 }} />
                                        <Typography variant="h5" sx={{ color: '#d81b98', fontWeight: 600, mb: 1 }}>
                                            Tìm kiếm
                                        </Typography>
                                        <Typography className="paperText">
                                            Bạn có thể sử dụng bộ lọc với các thông tin về sở thích, tuổi, vị trí,... để tìm
                                            người hẹn hò của bạn
                                        </Typography>
                                        <Fab
                                            size="large"
                                            sx={{
                                                bgcolor: '#ff4081',
                                                '&:hover': { bgcolor: '#d81b98' }
                                            }}
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
                </Container>

                <QuizButton />
            </Box>
        );
    }, [isLoading, error, homepageData]);
};
export default Home;

