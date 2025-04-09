import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import _ from 'lodash';
import './chatroom.css';
import {chatroomInfo, chatroomMessages, currentUser} from '../../datas/template.jsx'

const ChatRoom = () => {
    const chatroomInfo = chatroominfo;
    const chatroomMessages = chatRoomMessages;
    const message = null;
    let scrolled = false;
    const element = document.getElementById('chat');
    const updateScroll = () => {
        if (!scrolled && element) {
            element.scrollTop = element.scrollHeight;
        }
    };
    if (element) {
        element.addEventListener('scroll', () => {
            scrolled = true;
        });
    }
    updateScroll();
    const profileLink = `/profile/${chatroomInfo.username}`;
    return (
        <>
            <Box className="chatWrapper">
                <Box className="chatInfoWrapper">
                    <Button
                        variant="contained"
                        color="secondary"
                        className="button"
                        href="/chat"
                        startIcon={<ArrowBackIosNewIcon />}
                    >
                        All
                    </Button>
                    <Box>
                        <Link href={profileLink} className="chatInfoAvatarWrapper">
                            <Avatar
                                alt="Avatar"
                                src={chatroomInfo.profilePicture}
                                className="avatarchatroom"
                            />
                            <Typography variant="h5">{chatroomInfo.username}</Typography>
                        </Link>
                    </Box>
                    <Box></Box>
                </Box>
                <Box className="chatContent" id="chat">
                    {_.map(chatroomMessages, message => {
                        if (currentUser.username !== message.author) {
                            return (
                                <Box key={message.id} className="boxMessageOther">
                                    <Avatar alt="Avatar" src={message.profilePicture} />
                                    <div className="textBubbleOther">
                                        <span>{message.content}</span>
                                    </div>
                                </Box>
                            );
                        }
                        return (
                            <Box key={message.id} className="boxMessageMe">
                                <div className="textBubbleMe">
                                    <span>{message.content}</span>
                                </div>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Box className="messageInput">
                <Grid container spacing={2}>
                    <Grid item sm={10} xs={12}>
                        <TextField
                            value={message}
                            fullWidth
                            type="text"
                            name="message"
                            variant="outlined"
                            className="textFieldChatroom"
                        />
                    </Grid>
                    <Grid item sm={2} xs={12}>
                        <Button variant="contained" color="secondary">
                            Send message
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default ChatRoom;
