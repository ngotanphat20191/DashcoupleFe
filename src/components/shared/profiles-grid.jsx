import React, { memo, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import MediaCard from './components/media-card.jsx';
import './profiles-grid.css';

// Memoize the MediaCard component to prevent unnecessary re-renders
const MemoizedMediaCard = memo(MediaCard);

const ProfilesGrid = ({profiles, type, indexSkip, setindexskip, interests}) => {
    // Handle empty state
    if (_.isEmpty(profiles) && (type === "liking" || type === "like")) {
        return (
            <Box className="emptyPageWrapperProfileGrid">
                <Typography className="emptyPageTextProfileGrid" variant="h3">
                    Sorry, there is nothing to display yet <span role="img" aria-label="sad emoji">😢</span>. But don't worry, it's coming !
                </Typography>
            </Box>
        );
    }
    
    // Memoize the grid content to prevent unnecessary re-renders
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

// Export memoized component for better performance
export default memo(ProfilesGrid);
