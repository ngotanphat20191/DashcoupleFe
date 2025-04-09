import React, { useContext, useState, useEffect } from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, SwipeableDrawer, Badge, Link} from '@mui/material';
import NotificationDrawer from './components/notificationDrawer.jsx';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './nav.css'
import {baseAxios} from "../../config/axiosConfig.jsx";

const Nav = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(1);
    const [totalMessages, setTotalMessages] = useState(1);
    const [notifMenu, setNotifMenu] = React.useState({
        right: false,
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchNotifications();
                await fetchTotalNotifications();
                await fetchTotalMessages();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const fetchNotifications = async () => {
        baseAxios.get('/notification', {
        }).then((res) => {
            console.log(res.data)
            setNotifications(res.data)
        }).catch(err => {
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    };
    const fetchTotalMessages = async () => {
        setTotalMessages(3);
    };
    const fetchTotalNotifications = async () => {
        let unreadCount = 0;
        notifications.forEach(notification => {
            if (notification.is_read !== 1) {
                unreadCount++;
            }
        });
        setTotalNotifications(unreadCount);
    };
    const toggleDrawer = open => async () => {
        if (open) {
            if(totalNotifications !== 0) {
                setTotalNotifications(0);
                const notificationIdList = notifications.map(n => n.notificationId);
                baseAxios.post('/notification/check', {
                    notificationIdList: notificationIdList,
                }).then((res) => {
                    console.log(res.data)
                }).catch(err => {
                    if (err.status === 400) {
                        alert(err.response.data)
                    }
                })
            }
        }
        setNotifMenu({ ...notifMenu, right: open });
    };
    return (
        <AppBar position="static" className="Appbarnav" style={{backgroundColor: "#fc6ae7"}}>
            <Toolbar>
                <Typography variant="h6" className="matchaLogo">
                    <Link
                        href="/"
                        className="LogonavIcon"
                        style={{color:"white",  textDecoration: "none"}}
                    >
                        DashCouple
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
                            Đăng ký
                        </Button>{' '}
                        <Button color="inherit" href="/login">
                            Đăng nhập
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Nav;
