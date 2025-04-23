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
    if (_.isEmpty(profiles) && (type === "liking" || type === "like")) {
        return (
            <Box className="emptyPageWrapperProfileGrid">
                <Typography className="emptyPageTextProfileGrid" variant="h3">
                    Xin lỗi, hiên tại không có dữ liệu <span role="img" aria-label="sad emoji">😢</span>. Nhưng không sao, hãy chờ đợi nha !
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
