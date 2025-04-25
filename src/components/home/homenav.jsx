import {Box, List, ListItem, ListItemIcon, Stack, Tooltip} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './home.css';
import {useState} from 'react';

const Homenav = () => {
    const [activeItem, setActiveItem] = useState(null);

    function cleartoken() {
        localStorage.clear();
        window.location.href = '/login';
    }

    const handleIconHover = (index) => {
        setActiveItem(index);
    };

    const handleIconLeave = () => {
        setActiveItem(null);
    };

    const navItems = [
        {icon: AccountCircleIcon, link: "/profile", label: "Hồ sơ"},
        {icon: ChatIcon, link: "/chat", label: "Tin nhắn"},
        {icon: VisibilityIcon, link: "/visits", label: "Lượt xem"},
        {icon: ThumbUpAltIcon, link: "/likes", label: "Lượt thích"},
        {icon: ExitToAppIcon, onClick: cleartoken, label: "Đăng xuất"}
    ];

    return (
        <Stack className="homeNavContainer">
            <Box className="homeNavInner">
                <List>
                    {navItems.map((item, index) => (
                        <Tooltip
                            key={index}
                            title={item.label}
                            placement="right"
                            arrow
                        >
                            <ListItem
                                component="a"
                                href={item.link}
                                onClick={item.onClick}
                                className={`homeNavItem ${activeItem === index ? 'activeNavItem' : ''}`}
                                onMouseEnter={() => handleIconHover(index)}
                                onMouseLeave={handleIconLeave}
                            >
                                <ListItemIcon className="homeNavIcon">
                                    <item.icon fontSize="medium"/>
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Box>
        </Stack>
    );
};

export default Homenav;