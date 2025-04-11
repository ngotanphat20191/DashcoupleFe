import {List, ListItem, ListItemIcon, Stack} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import './home.css'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
const Homenav = () => {
    function cleartoken(){
        localStorage.clear();
        window.location.href='/login';
    }
    return (
    <Stack className="leftColumnHome" style={{justifyContent: "center"}}>
        <List>
            <ListItem  component="a" href="/profile">
                <ListItemIcon>
                    <AccountCircleIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem  component="a" href="/chat">
                <ListItemIcon>
                    <ChatIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem  component="a" href="/visits">
                <ListItemIcon>
                    <VisibilityIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem component="a" href="/likes">
                <ListItemIcon>
                    <ThumbUpAltIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
            <ListItem component="a" onClick={cleartoken}>
                <ListItemIcon>
                    <ExitToAppIcon className="leftColumnIconHome"/>
                </ListItemIcon>
            </ListItem>
        </List>
    </Stack>
    );
};
export default Homenav;
