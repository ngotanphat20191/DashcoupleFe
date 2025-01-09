import React, { useContext, useState, useEffect } from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, SwipeableDrawer, Badge, Link} from '@mui/material';
import NotificationDrawer from './components/notificationDrawer.jsx';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './nav.css'
import {notification} from '../../datas/template.jsx'

const Nav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(1);
    const [totalMessages, setTotalMessages] = useState(1);
    const [notifMenu, setNotifMenu] = React.useState({
        right: false,
    });
    useEffect(() => {
        const fetchTotalNotifications = async () => {
            setTotalNotifications(3);
        };

        const fetchTotalMessages = async () => {
            setTotalMessages(3);
        };
        fetchTotalNotifications();
        fetchTotalMessages();
    }, []);
    const fetchNotifications = async () => {
        setNotifications(notification);
    };

    const toggleDrawer = open => async () => {
        if (open) {
            await fetchNotifications();
            setTotalNotifications(0);
        }
        setNotifMenu({ ...notifMenu, right: open });
    };
    return (
        <AppBar position="static" className="Appbarnav">
            <Toolbar>
                <Typography variant="h6" className="matchaLogo">
                    <Link
                        href="/"
                        className="LogonavIcon"
                    >
                        Matcha
                    </Link>
                </Typography>
                {isLoggedIn ? (
                    <>
                        <IconButton color="inherit" href="/chat">
                            <Badge color="secondary" badgeContent={totalMessages} showZero>
                                <ChatBubbleIcon className="navIcon" />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={toggleDrawer(true)} color="inherit">
                            <Badge color="secondary" badgeContent={totalNotifications} showZero>
                                <NotificationsIcon className="navIcon" />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" href="profile">
                            <AccountCircleIcon className="navIcon" />
                        </IconButton>
                        <IconButton color="inherit">
                            <ExitToAppIcon className="navIcon" />
                        </IconButton>
                        <SwipeableDrawer
                            anchor="right"
                            open={notifMenu.right}
                            onClose={toggleDrawer(false)}
                            onOpen={toggleDrawer(true)}
                        >
                            <NotificationDrawer
                                toggleDrawer={toggleDrawer}
                                notifications={notifications}
                            />
                        </SwipeableDrawer>
                    </>
                ) : (
                    <>
                        <Button color="inherit" href="/signup">
                            Signup
                        </Button>{' '}
                        <Button color="inherit" href="/login">
                            Login
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Nav;
