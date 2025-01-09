import React, { Fragment } from 'react';
import Box from '@mui/material/Box';
import _ from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import './chat.css';
import {matchList} from '../../datas/template.jsx'
const Chat = () => {
    if (_.isEmpty(matchList)) {
        return (
            <Box className="emptyChat">
        <span role="img" aria-label="emoji" className="emptyChatTitle">
          You don't have matches yet. But don't worry, it's coming😌
        </span>{' '}
                <img src="https://media.giphy.com/media/Az1CJ2MEjmsp2/giphy.gif" alt="lonely ghost town gif"/>
            </Box>
        );
    }
    return (
        <List className="rootchat">
            {_.map(matchList, matchedProfile => {
                const redirectLink = `/chatroom/${matchedProfile.matchid}`;
                return (
                    <Fragment key={matchedProfile.matchid}>
                        <Button
                            className="buttonChatroom"
                            variant="text"
                            href={redirectLink}
                        >
                            <ListItem
                                alignItems="flex-start"
                                className={
                                    matchedProfile.read === false ? "notReadMessage" : null
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar alt="avatar" src={matchedProfile.profilePicture} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={matchedProfile.username}
                                    secondary={matchedProfile.content}
                                />
                            </ListItem>
                        </Button>
                        <Divider variant="inset" component="li" />
                    </Fragment>
                );
            })}
        </List>
    );
};
export default Chat;