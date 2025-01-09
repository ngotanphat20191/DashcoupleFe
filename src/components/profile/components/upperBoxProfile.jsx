import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from '@mui/material/Fab';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BlockIcon from '@mui/icons-material/Block';
import './upperBoxProfile.css'
import '../profile.css'
const UpperBoxProfile = ({profile, type}) => {
        const [blocked, setBlocked] = useState(false);
        const [reported, setReported] = useState(false);
        const [anchorEl, setAnchorEl] = React.useState(null);
        const handleClick = event => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        const chatroomLink = `/chatroom/${profile.matchId}`;
    return (
        <Box
            className={
                profile.match === true
                    ? "boxUpProfileMatch"
                    : "boxUpProfile"
            }
        >
            <Grid container className="containerUpProfile" direction="row">
                <Grid item xs={12} sm={6} className="containerUpProfileLeft">
                    <Grid item xs={6} sm={5}>
                        <img
                            className="profileImgUpperBox"
                            src={
                                'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
                            }
                            alt="My profile"
                            width="90%"
                        />
                        {blocked ? (
                            <BlockIcon
                                className="blockedIconUpperBox"
                                color="secondary"
                                fontSize="large"
                            />
                        ) : null}
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sm={7}
                        className="containerUpProfileLeftInfo"
                    >
                        <div>
                            <span>{profile.username}</span>
                        </div>
                        <div>
              <span>
                {profile.age ? profile.age : 'Age undefined '}
              </span>
                            <span>
                {profile.location ? profile.location : null}
              </span>
                            {type === 'public' ? "connected" : null}
                        </div>
                    </Grid>
                </Grid>
                <Grid item sm={6} xs={12} className="containerUpProfileRight">
                    <Grid
                        item
                        bgcolor="secondary.main"
                        xs={12}
                        sm={4}
                        className="containerUpProfileRightFabs"
                    >
                        <Fab
                            color="secondary"
                            size="small"
                            className="fabUpBox"
                        >
                            {profile.popularityRate}%
                        </Fab>
                    </Grid>
                    {type === 'public' ? (
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            className="containerUpProfileRightFabs"
                        >
                            {profile.match ? (
                                <Fab
                                    color="primary"
                                    size="small"
                                    className="fabUpBox"
                                    href={chatroomLink}
                                >
                                    <MailOutlineIcon />
                                </Fab>
                            ) : null}
                            {liked ? (
                                <Fab
                                    color="primary"
                                    size="small"
                                    className="fabUpBox"
                                >
                                    <FavoriteIcon />
                                </Fab>
                            ) : (
                                <Fab
                                    color="primary"
                                    size="small"
                                    className="fabUpBox"
                                >
                                    <FavoriteBorderIcon />
                                </Fab>
                            )}
                            <div>
                                <Fab
                                    color="secondary"
                                    size="small"
                                    className="fabUpBox"
                                >
                                    <ReportProblemIcon />
                                </Fab>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem>
                                        {blocked ? 'Unblock' : 'Block'}
                                    </MenuItem>
                                    {reported ? (
                                        <MenuItem disabled onClick={handleClose}>
                                            You reported this user
                                        </MenuItem>
                                    ) : (
                                        <MenuItem>
                                            Report
                                        </MenuItem>
                                    )}
                                </Menu>
                            </div>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
        </Box>
    );
};

export default UpperBoxProfile;
