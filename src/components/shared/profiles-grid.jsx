import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import MediaCard from './components/media-card.jsx';
import './profiles-grid.css'
const ProfilesGrid = ({profiles, currentUserProfile, type}) => {
    const [displayedProfiles, setDisplayedProfiles] = useState([]);
    const displayMoreProfiles = () => {
        setDisplayedProfiles((prevDisplayed) =>
            profiles.slice(0, prevDisplayed.length + 3)
        );
    };

    useEffect(() => {
        displayMoreProfiles();
    }, [profiles]);
    if (_.isEmpty(profiles) && (type === "like" || type === "visit")) {
        return (
            <Box className="emptyPageWrapperProfileGrid">
                <Typography className="emptyPageTextProfileGrid" variant="h3">Sorry, there is nothing to display yet <span role="img" aria-label="sad emoji">😢</span>. But don't worry, it's coming !</Typography>
            </Box>
        )
    }
    return (
        <div className="wrapperProfileGrid">
            <Container>
                <InfiniteScroll
                    dataLength={displayedProfiles.length}
                    next={displayMoreProfiles}
                    hasMore
                    loader={
                        <div className="progressProfileGrid">
                            <CircularProgress color="secondary" />
                        </div>
                    }
                >
                    <Grid container spacing={3}>
                        {_.map(displayedProfiles, profile => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                lg={3}
                                className="centerProfileGrid"
                                key={profile.username}
                            >
                                <MediaCard
                                    field={profile}
                                    profile={currentUserProfile}
                                    type={type}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Container>
        </div>
    );
};

export default ProfilesGrid;
