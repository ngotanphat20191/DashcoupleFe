import React, {useRef, Fragment, useEffect, useState, useCallback, memo, useMemo} from 'react';
import Box from '@mui/material/Box';
import _ from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import './chat.css';
import {matchList} from '../../datas/template.jsx'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Homenav from '../home/homenav.jsx';
import {Stack, CircularProgress} from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import '../chatroom/chatroom.css';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from '@mui/material/Link';
import {baseAxios, createCancelToken} from "../../config/axiosConfig.jsx";
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatImageUploader from './components/chatuploadimage.jsx';

const MemoizedHomenav = memo(Homenav);

const Chat = () => {
    const [checkroom, setcheckroom] = useState(null);
    const [profile, setprofile] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messagessocket, setMessagesSocket] = useState([]);
    const [messagessocketcomplete, setMessagesSocketComplete] = useState([]);
    const [messagesend, setMessageSend] = useState("");
    const [homepageData, setHomepageData] = useState(null);
    const [videocallinfo, setVideoCallInfo] = useState(null);
    const [imagetarget, setImagetarget] = useState();
    const [nametarget, setNametarget] = useState();
    const [targetID, setTargetID] = useState();
    const [flowMessageID, setFlowMessageID] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    
    const element = document.getElementById('chat');
    const prevLength = useRef(messagessocket.length);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const chatRef = useRef(null);
    const clientRef = useRef(null);
    let scrolled = false;
    
    // Define updateScroll function before it's used in useEffect
    const updateScroll = useCallback(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, []);
    
    // Initialize WebSocket client only once
    useEffect(() => {
        if (!clientRef.current) {
            const socket = new SockJS("http://localhost:8080/ws");
            clientRef.current = new Client({
                webSocketFactory: () => socket,
                debug: process.env.NODE_ENV === 'development' ? (str) => console.log(str) : null,
                reconnectDelay: 5000,
            });
        }
    }, []);
    
    const client = clientRef.current;
    
    // Memoize the WebSocket connection function to prevent unnecessary recreations
    const connectWebSocket = useCallback(() => {
        if (!homepageData || !homepageData.userid) return;
        
        client.onConnect = () => {
            setIsSocketConnected(true);
            
            // Subscribe to messages
            const subscription = client.subscribe(`/topic/message/${homepageData.userid}`, (res) => {
                try {
                    const receivedMessage = JSON.parse(res.body);
                    
                    if (receivedMessage?.flowMessageId) {
                        setMessagesSocket(prevMessages => [...prevMessages, receivedMessage]);
                    } else if (receivedMessage) {
                        setVideoCallInfo(receivedMessage);
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });
            
            // Store subscription reference for cleanup
            return subscription;
        };

        client.onDisconnect = () => {
            setIsSocketConnected(false);
        };
        
        client.onStompError = (frame) => {
            console.error('STOMP error', frame);
            setError('Connection error. Please try again.');
        };

        // Only activate if not already connected
        if (!client.active) {
            client.activate();
        }
    }, [homepageData]);
    
    // Connect to WebSocket when homepageData is available
    useEffect(() => {
        if (homepageData && homepageData.userid) {
            const subscription = connectWebSocket();
            
            return () => {
                // Clean up subscription
                if (subscription) {
                    subscription.unsubscribe();
                }
                
                // Only deactivate when component unmounts
                if (client && client.active) {
                    client.deactivate();
                    setIsSocketConnected(false);
                }
            };
        }
    }, [homepageData, connectWebSocket]);
    // Process new messages efficiently
    useEffect(() => {
        if (messagessocket.length > prevLength.current) {
            prevLength.current = messagessocket.length;
            const lastMessage = messagessocket[messagessocket.length - 1];
            
            if (lastMessage && messages && lastMessage.flowMessageId === messages.flowMessageId) {
                setMessagesSocketComplete(prevMessages => [...prevMessages, lastMessage]);
            }
        }
    }, [messagessocket, messages]);
    
    // Scroll to bottom when messages change
    useEffect(() => {
        updateScroll();
    }, [messages, messagessocketcomplete]);
    
    // Fetch initial data with proper error handling and loading states
    useEffect(() => {
        const cancelTokenSource = createCancelToken();
        
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null); // Reset any previous errors
            
            try {
                // Fetch homepage data
                const homepageResponse = await baseAxios.get('/homepage', {
                    cancelToken: cancelTokenSource.token
                });
                setHomepageData(homepageResponse.data);
                
                // Fetch chat profiles
                const chatResponse = await baseAxios.get('/chat/', {
                    cancelToken: cancelTokenSource.token
                });
                setprofile(chatResponse.data);
                
                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    // Request was cancelled, ignore
                    return;
                }
                
                setIsLoading(false);
                if (err.response?.status === 400) {
                    setError(err.response.data);
                } else {
                    setError("Error loading chat data");
                    console.error("Error fetching chat data:", err);
                }
            }
        };
        
        fetchInitialData();
        
        return () => {
            cancelTokenSource.cancel('Component unmounted');
        };
    }, []);
    // Memoize the sendMessage function to prevent unnecessary recreations
    const sendMessage = useCallback(async (flowMessageId, receiverId, content, image, time) => {
        // Don't send empty messages
        if (!content.trim()) return;
        
        // Create message data
        const messageData = {
            flowMessageId: flowMessageId,
            targetID: receiverId,
            content: content,
            time: time,
            images: image,
        };
        
        // Optimistically update UI
        setMessagesSocketComplete(prevMessages => [...prevMessages, messageData]);
        setMessageSend("");
        
        try {
            // Send via WebSocket if connected
            if (client && client.connected) {
                client.publish({
                    destination: `/topic/message/${receiverId}`,
                    body: JSON.stringify(messageData),
                });
            } else {
                console.warn("WebSocket not connected, message will only be saved to database");
            }
            
            // Save to database
            await baseAxios.post('/chat/details/create', {
                UserId: targetID,
                UserContent: content,
                FlowMessageId: flowMessageId,
                UserImage: image,
            });
        } catch (err) {
            console.error("Error sending message:", err);
            if (err.response?.status === 400) {
                // Show error but don't alert (better UX)
                console.error(err.response.data);
            }
        }
    }, [client, targetID]);
    // Memoize the sendVideoCallInfo function to prevent unnecessary recreations
    const sendVideoCallInfo = useCallback((userid, targetid, name, image) => {
        if (!client || !client.connected) {
            console.error("WebSocket not connected, cannot initiate video call");
            return false;
        }
        
        try {
            const messageData = {
                userid: userid,
                targetid: targetid,
                name: name,
                image: image,
            };
            
            client.publish({
                destination: `/topic/message/${targetid}`,
                body: JSON.stringify(messageData),
            });
            
            return true;
        } catch (error) {
            console.error("Error sending video call info:", error);
            return false;
        }
    }, [client]);
    const handleClose = () => {
        setOpen(false);
        setVideoCallInfo(null);

    };
    const fetchHomepageData = async () => {
        try {
            const res = await baseAxios.get('/homepage');
            setHomepageData(res.data);
        } catch (err) {
            if (err.response?.status === 400) {
                alert(err.response.data);
            } else {
                console.error("Error fetching homepage data:", err);
            }
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const daysMap = ["T8", "T2", "T3", "T4", "T5", "T6", "T7"];
        const hours = date.getHours().toString().padStart(2, "0"); 
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${hours}:${minutes} ${daysMap[date.getDay()]} ${day}/${month}/${year}`;
    };
    const formatDays = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const timeDiff = today - date;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const daysMap = ["T8", "T2", "T3", "T4", "T5", "T6", "T7"];
        return daysDiff > 7 ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}` : daysMap[date.getDay()];
    };
    function handleGetFullMessage(FlowMessageId, UserTargetId) {
        baseAxios.post('/chat/details', {
            UserTargetId: UserTargetId,
            UserTargetName: "",
            FlowMessageId: FlowMessageId,
            LastMessage: "",
            images: null,
        }).then((res) => {
            setMessages(res.data)
        }).catch(err => {
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }
    function handleMatchesDelete(data) {
        baseAxios.post('/matches/delete', {
            UserIdTarget: data.id
        }).then((res) => {
            console.log(res.data)
        }).catch(err => {
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }
    // Memoize the chat rendering function for better performance
    const navChatRender = useCallback(() => {
        if (!profile) return null;
        
        // Get the last message for display
        const lastMessage = messagessocketcomplete.length > 0 
            ? messagessocketcomplete[messagessocketcomplete.length - 1] 
            : null;
            
        return _.map(profile, (matchedProfile) => {
            // Determine which message and date to show
            const messageToShow = (lastMessage?.flowMessageId === matchedProfile.flowMessageId) 
                ? lastMessage.content 
                : matchedProfile.LastMessage;
                
            const dateToShow = (lastMessage?.flowMessageId === matchedProfile.flowMessageId) 
                ? lastMessage.time 
                : matchedProfile.LastMessageSentTime;
                
            // Count unread messages (optimized)
            const unreadCount = messagessocketcomplete
                ? messagessocketcomplete.filter(msg => msg.flowMessageId === matchedProfile.FlowMessageId).length
                : 0;
                
            // Memoize the click handler
            const handleClick = () => {
                setcheckroom(1);
                handleGetFullMessage(matchedProfile.FlowMessageId, matchedProfile.UserTargetId);
                setImagetarget(matchedProfile.images[0]);
                setNametarget(matchedProfile.UserTargetName);
                setTargetID(matchedProfile.UserTargetId);
                setFlowMessageID(matchedProfile.FlowMessageId);
            };

            return (
                <Fragment key={matchedProfile.FlowMessageId}>
                    <Button
                        className="buttonChatroom"
                        variant="text"
                        style={{
                            width: "100%",
                            border: "2px solid #f7dcf7",
                            marginTop: "10px",
                            marginBottom: "10px",
                            borderRadius: "20px"
                        }}
                        onClick={handleClick}
                    >
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="avatar" src={matchedProfile.images[0]} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={matchedProfile.UserTargetName}
                                secondary={messageToShow}
                            />
                            <div>
                                <Typography style={{ color: "#888888", fontSize: "13px", marginTop:"8px" }}>{formatDays(dateToShow)}</Typography>
                                {unreadCount > 0 && (
                                    <Typography
                                        style={{
                                            color: "white",
                                            fontSize: "13px",
                                            marginTop: "2px",
                                            width: "22px",
                                            height: "22px",
                                            borderRadius: "50%",
                                            backgroundColor: "#ff4848",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {unreadCount}
                                    </Typography>
                                )}
                            </div>
                        </ListItem>
                    </Button>
                    <Divider variant="inset" component="li" />
                </Fragment>
            );
        });
    });
    useEffect(() => {
        navChatRender();
    }, [profile, messagessocketcomplete]);
    if (element) {
        element.addEventListener('scroll', () => {
            scrolled = true;
        });
    }
    if (_.isEmpty(matchList)) {
        return (
            <Box className="emptyChat">
        <span role="img" aria-label="emoji" className="emptyChatTitle">
          Hiện tại bạn chưa ghép đôi với đối tượng hẹn hò nào. Nhưng đừng lo, điều đó sẽ đến sớm thôi 😌
        </span>{' '}
                <img src="https://media.giphy.com/media/Az1CJ2MEjmsp2/giphy.gif" alt="lonely ghost town gif"/>
            </Box>
        );
    }
    return (
        <>
            {videocallinfo && (
                <Dialog
                    fullScreen={fullScreen}
                    open={true}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        Bạn nhận được video call từ
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar alt="Avatar" src={videocallinfo?.image} style={{ width: "60px", height: "60px" }} />
                            <Typography style={{ color: "#575757", fontSize: "17px", marginTop:"5px"}}>{videocallinfo?.name}</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                autoFocus
                                style={{ border: "1px solid #000", padding: "6px 12px", marginTop: "-20px", borderRadius: "20px", color: "white", backgroundColor:"#2f7cd3"}}
                                onClick={() => {
                                    window.open(`https://localhost:8443?id=${videocallinfo?.targetid}&idtarget=${videocallinfo?.userid}`, "_blank");
                                    setVideoCallInfo(null);
                                }}
                            >
                                Chấp nhận cuộc gọi
                            </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Stack style={{ display: "flex", flexDirection: "row", border: "2px solid #fc6ae7", width: "90%", marginLeft: "100px", marginRight: "100px", marginTop: "50px", borderRadius: "20px", backgroundColor: "#ffe8fd" }}>
                <Homenav />
                <List style={{ width: "28%", height: "100%", marginLeft: "10px", marginTop: "10px", marginBottom: "10px", borderRadius: "20px", backgroundColor: "#fcf5fc" }}>
                    {navChatRender()}
                </List>
                {checkroom ? (
                    <Box className="chatWrapper">
                        <Box className="chatInfoWrapper">
                            <Button
                                variant="contained"
                                color="secondary"
                                className="button"
                                href="/chat"
                                startIcon={<ArrowBackIosNewIcon />}
                            >
                                Quay lại
                            </Button>
                            <Box>
                                <Link className="chatInfoAvatarWrapper">
                                    <Avatar
                                        alt="Avatar"
                                        src={imagetarget}
                                        className="avatarchatroom"
                                    />
                                    <Typography variant="h5">{nametarget}</Typography>
                                </Link>
                            </Box>
                        </Box>
                        <Box className="chatContent" id="chat" ref={chatRef}>
                            {messages?.content && Object.entries(messages.content).map(([id, userMessages]) => {
                                if (userMessages.userid !== messages.userIdCurrent) {
                                    return (
                                        <Box key={userMessages.time} className="boxMessageOther">
                                            <Avatar alt="Avatar" src={imagetarget} />
                                            <div className="textBubbleOther">
                                                <div>{userMessages.content}</div>
                                                <Typography style={{ color: "#888888", fontSize: "13px" }}>
                                                    {formatDate(userMessages.time)}
                                                </Typography>
                                            </div>
                                        </Box>
                                    );
                                }
                                return (
                                    <Box key={userMessages.time} className="boxMessageMe">
                                        <div className="textBubbleMe">
                                            <div>{userMessages.content}</div>
                                            <Typography style={{ color: "#888888", fontSize: "13px" }}>{formatDate(userMessages.time)}</Typography>
                                        </div>
                                        <Avatar alt="Avatar" src={homepageData.images[0]} />
                                    </Box>
                                );
                            })}
                            {messagessocketcomplete && messages &&
                                messagessocketcomplete.map((message) => {
                                    console.log(message.targetID !== messages.userIdCurrent)
                                    console.log(message.flowMessageId == messages.flowMessageId)
                                    console.log(message.targetID === messages.userIdCurrent)
                                    if (message.targetID !== messages.userIdCurrent && message.flowMessageId == messages.flowMessageId) {
                                        return (
                                            <Box key={message.time} className="boxMessageMe">
                                                <div className="textBubbleMe">
                                                    <div>{message.content}</div>
                                                    <Typography style={{ color: "#888888", fontSize: "13px" }}>
                                                        {formatDate(message.time)}
                                                    </Typography>
                                                </div>
                                                <Avatar alt="Avatar" src={homepageData.images[0]} />
                                            </Box>
                                        );
                                    } else if (message.targetID === messages.userIdCurrent && message.flowMessageId == messages.flowMessageId) {
                                        return (
                                            <Box key={message.time} className="boxMessageOther">
                                                <Avatar alt="Avatar" src={imagetarget} />
                                                <div className="textBubbleOther">
                                                    <div>{message.content}</div>
                                                    <Typography style={{ color: "#888888", fontSize: "13px" }}>
                                                        {formatDate(message.time)}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        );
                                    }
                                    return null;
                                })
                            }
                        </Box>
                        <Box className="messageInput" style={{ left: '50px' }}>
                            <Grid container spacing={2}>
                                <Grid item sm={10} xs={12}>
                                    <TextField
                                        value={messagesend}
                                        fullWidth
                                        type="text"
                                        name="message"
                                        variant="outlined"
                                        className="textFieldChatroom"
                                        onChange={(e) => setMessageSend(e.target.value)}
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                    <ChatImageUploader
                                        onImageUploaded={(imageUrl) => {
                                            // Send the image URL as a message
                                            const now = new Date().toLocaleString();
                                            sendMessage(flowMessageID, targetID, null, imageUrl, now);
                                        }}
                                        disabled={!checkroom}
                                    />
                                    <Button variant="contained" onClick={() => {
                                        const now = new Date().toLocaleString();
                                        sendMessage(flowMessageID, targetID, messagesend, null, now);
                                    }}>
                                        <SendIcon />
                                    </Button>
                                    <Button variant="contained" style={{ marginTop: "5"}} onClick={() => {
                                        window.open(`https://localhost:8443?id=${homepageData.userid}`, "_blank");
                                        sendVideoCallInfo(homepageData.userid, messages.UserIdTarget, homepageData.name, homepageData.images[0]);
                                    }}>
                                        <VideocamIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                ) : (
                    <Box className="emptychatWrapper">
                        <div style={{ transform: 'translateY(800%)', textAlign: 'center' }}>
                            Hãy chọn đối tượng hẹn hò để tiến hành trò chuyện với họ !
                        </div>
                    </Box>
                )}
            </Stack>
        </>
    );
};
export default Chat;