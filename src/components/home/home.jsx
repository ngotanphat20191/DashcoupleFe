import React, { useContext, useState } from 'react';
import { Box, Typography, Fab, Avatar, Grid, List, ListItem, ListItemIcon, ListItemText, Paper,} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import './home.css'
import {currentUser} from '../../datas/template.jsx'

const Home = () => {
    const secureAuth=true;
    if (secureAuth) {
        return (
            <Box className="dashboard">
                <Box className="upDivWrapperHome">
                    <Avatar
                        alt="Remy Sharp"
                        src={currentUser.profilePicture}
                        className="avatarHome"
                    />
                    <Typography variant="h4" color="primary">
                        Welcome {currentUser.username}
                    </Typography>
                </Box>
                <Grid container className="gridWrapperHome">
                    <Grid item xs={12} sm={3} lg={2} className="leftColumnHome">
                        <List>
                            <ListItem button component="a" href="/profile">
                                <ListItemIcon>
                                    <AccountCircleIcon className="leftColumnIconHome" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="My profile"
                                    className="leftColumnTextHome"
                                />
                            </ListItem>
                            <ListItem button component="a" href="/chat">
                                <ListItemIcon>
                                    <ChatIcon className="leftColumnIconHome" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Messages"
                                    className="leftColumnTextHome"
                                />
                            </ListItem>
                            <ListItem button component="a" href="/visits">
                                <ListItemIcon>
                                    <VisibilityIcon className="leftColumnIconHome" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Visits"
                                    className="leftColumnTextHome"
                                />
                            </ListItem>
                            <ListItem button component="a" href="/likes">
                                <ListItemIcon>
                                    <ThumbUpAltIcon className="leftColumnIconHome" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="They liked me"
                                    className="leftColumnTextHome"
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={10} className="columnCTAS">
                        <Typography
                            variant="h3"
                            color="primary"
                            gutterBottom
                            align="center"
                            className="findMatchTitleHome"
                        >
                            Find your perfect Match
                        </Typography>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6} className="columnPaper">
                                <Paper elevation={3} className="paperCTA">
                                    <FavoriteIcon fontSize="large" color="secondary" />
                                    <Typography variant="h4" color="primary">
                                        Suggestions
                                    </Typography>
                                    <Typography className="paperText">
                                        We gathered profiles that could be a good fit for you!
                                        Here's a bunch
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
                                <Paper elevation={3} className="paperCTA">
                                    <SearchIcon fontSize="large" color="secondary" />
                                    <Typography variant="h4" color="primary">
                                        Search
                                    </Typography>
                                    <Typography className="paperText">
                                        You can filter users according to your interests, age,
                                        distance... Have fun!
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
            </Box>
        );
    }
    return (
        <>
            <Box className="homeWrapper">
                <Box className="bgImage">
                    <Box className="homeTextDiv">
                        <Typography variant="h3" color="primary" gutterBottom>
                            Make the first move
                        </Typography>
                        <Typography>
                            Start meeting new people in your area! If you already have an
                            account, sign in to use Matcha.
                        </Typography>
                        <div className="CTAWrapper">
                            <Fab
                                variant="extended"
                                color="secondary"
                                aria-label="add"
                                className="CTA"
                                href="/signup"
                            >
                                Sign up
                            </Fab>
                            <Fab
                                variant="extended"
                                aria-label="add"
                                className="signIn CTA"
                                href="/login"
                            >
                                Sign in
                            </Fab>
                        </div>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default Home;

