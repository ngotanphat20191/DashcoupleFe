import { memo, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import MediaCard from './components/media-card.jsx';
import './profiles-grid.css';

const MemoizedMediaCard = memo(MediaCard);

const ProfilesGrid = ({profiles, type, indexSkip, setindexskip, interests}) => {
    // Check for empty or invalid profiles
    if (profiles.length === indexSkip.length) {
        return (
            <Box className="emptyPageWrapperProfileGrid" sx={{ 
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
                <Typography className="emptyPageTextProfileGrid" sx={{ 
                    fontSize: "1.2rem", 
                    fontWeight: "bold", 
                    color: "#ff66c4",
                    textAlign: "center",
                    mb: 1
                }}>
                    Hiện tại không có đối tượng nào
                </Typography>
                <Typography sx={{ 
                    fontSize: "1rem", 
                    color: "#666",
                    textAlign: "center" 
                }}>
                    {type === "liking" ? "Hãy thích nhiều người hơn để xem lịch sử của bạn ở đây!" : 
                     type === "like" ? "Hãy cố gắng tìm kiếm thêm để có cơ hội ghép đôi!" :
                     "Không có dữ liệu để hiển thị"}
                </Typography>
            </Box>
        );
    }
    
    const gridContent = useMemo(() => {
        if (type === "liking" || type === "like" || type === "preview") {
            return (
                <Grid container spacing={3} className="centerProfileGrid">
                    <Grid item xs={12} sm={6} md={3} lg={3} className="centerProfileGrid">
                        <MemoizedMediaCard
                            profiles={profiles}
                            type={type}
                            interests={interests}
                       />
                     </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container spacing={3} className="centerProfileGrid">
                    <Grid item xs={12} sm={6} md={3} lg={3} className="centerProfileGrid">
                        <MemoizedMediaCard
                            profiles={profiles}
                            type={type}
                            index='1'
                            indexSkip={indexSkip}
                            setindexskip={setindexskip}
                            interests={interests}
                        />
                   </Grid>
                 </Grid>
            );
        }
    }, [profiles, type, indexSkip, setindexskip, interests]);
    
    return (
        <div className="wrapperProfileGrid">
            <Container>
                {gridContent}
            </Container>
        </div>
    );
};

export default memo(ProfilesGrid);
