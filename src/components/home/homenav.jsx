import {List, ListItem, ListItemIcon, Stack} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import './home.css'

const Homenav = () => {
    return (
    <Stack className="leftColumnHome" style={{justifyContent: "center"}}>
        <List>
            <ListItem button component="a" href="/profile">
                <ListItemIcon>
                    <AccountCircleIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem button component="a" href="/chat">
                <ListItemIcon>
                    <ChatIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem button component="a" href="/visits">
                <ListItemIcon>
                    <VisibilityIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem button component="a" href="/likes">
                <ListItemIcon>
                    <ThumbUpAltIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
        </List>
    </Stack>
    );
};
export default Homenav;
