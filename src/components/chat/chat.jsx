import {memo, useCallback, useEffect, useRef, useState} from 'react';
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
import {matchList} from '../../datas/template.jsx';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Homenav from '../home/homenav.jsx';
import {Stack} from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import '../chatroom/chatroom.css';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from '@mui/material/Link';
import {baseAxios, createCancelToken, matchesAxios} from "../../config/axiosConfig.jsx";
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatImageUploader from './components/chatuploadimage.jsx';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MemoizedHomenav = memo(Homenav);

const Chat = () => {
    const [checkroom, setCheckroom] = useState(null);
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messageSocket, setMessageSocket] = useState([]);
    const [messageSocketComplete, setMessageSocketComplete] = useState([]);
    const [messageSend, setMessageSend] = useState("");
    const [homepageData, setHomepageData] = useState(null);
    const [videoCallInfo, setVideoCallInfo] = useState(null);
    const [imageTarget, setImageTarget] = useState();
    const [nameTarget, setNameTarget] = useState();
    const [targetID, setTargetID] = useState();
    const [flowMessageID, setFlowMessageID] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const prevLength = useRef(messageSocket.length);
    const [open, setOpen] = useState(false);
    const [checkidroom, setCheckIDRoom] = useState(null)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const chatRef = useRef(null);
    const clientRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const client = clientRef.current;

    const toggleMenu = (id) => {
        setOpenMenuId(prev => (prev === id ? null : id));
    };
    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown-menu') && !event.target.closest('.ellipsis-button')) {
            setOpenMenuId(null);
        }
    };
    const updateScroll = useCallback(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, []);
    const deleteMatches = (id) => {
        matchesAxios.post('/matches/delete', {
            UserIdTarget: id,
        }).then(res => {
            setProfile(prevProfile => prevProfile.filter(profile => profile.FlowMessageId !== id));
            alert(res.data)
        }).catch(err => {
        })
    };
    useEffect(() => {
        const socket = new SockJS('https://present-ghastly-puma.ngrok-free.app/api/user/websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => {},
            onConnect: () => {
                setIsSocketConnected(true);

                client.subscribe(`/topic/message/${homepageData.userid}`, (res) => {
                    try {
                        const receivedMessage = JSON.parse(res.body);

                        if (receivedMessage?.flowMessageId) {
                            setMessageSocket(prevMessages => [...prevMessages, receivedMessage]);
                        } else if (receivedMessage) {
                            setVideoCallInfo(receivedMessage);
                        }
                    } catch (error) {
                    }
                });

                const pingInterval = setInterval(() => {
                    client.publish({
                        destination: "/app/ping", // Send ping signal to server
                        body: JSON.stringify({ signal: "ping" }),
                    });
                }, 10000); // 10 seconds

                client.onDisconnect = () => {
                    setIsSocketConnected(false);
                    clearInterval(pingInterval);
                };
            },
            onStompError: (frame) => {
                setError('Connection error. Please try again.');
            },
        });

        client.activate();

        clientRef.current = client;

        return () => {
            if (clientRef.current && clientRef.current.active) {
                clientRef.current.deactivate();
            }
        };
    }, [homepageData]);
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (messageSocket.length > prevLength.current) {
            prevLength.current = messageSocket.length;
            const lastMessage = messageSocket[messageSocket.length - 1];

            if (lastMessage && messages && lastMessage.flowMessageId == messages.flowMessageId) {
                setMessageSocketComplete(prevMessages => [...prevMessages, lastMessage]);
            }
        }
    }, [messageSocket, messages]);

    useEffect(() => {
        updateScroll();
    }, [messages, messageSocketComplete]);

    useEffect(() => {
        const cancelTokenSource = createCancelToken();

        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const homepageResponse = await baseAxios.get('/homepage', {
                    cancelToken: cancelTokenSource.token
                });
                setHomepageData(homepageResponse.data);

                const chatResponse = await baseAxios.get('/chatting', {
                    cancelToken: cancelTokenSource.token
                });
                setProfile(chatResponse.data);

                setIsLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
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

    const sendMessage = useCallback(async (flowMessageId, receiverId, content, image, time) => {
        if (!content?.trim() && !image) return;

        const messageData = {
            flowMessageId: flowMessageId,
            targetID: receiverId,
            content: content,
            time: time,
            image: image,
        };

        setMessageSocketComplete(prevMessages => [...prevMessages, messageData]);
        setMessageSend("");

        try {
            if (client && client.connected) {
                client.publish({
                    destination: `/topic/message/${receiverId}`,
                    body: JSON.stringify(messageData),
                });
            } else {
                console.warn("WebSocket not connected, message will only be saved to database");
            }

            await baseAxios.post('/chat/details/create', {
                UserId: targetID,
                UserContent: content,
                FlowMessageId: flowMessageId,
                UserImage: image,
            });
        } catch (err) {
            console.error("Error sending message:", err);
            if (err.response?.status === 400) {
                console.error(err.response.data);
            }
        }
    }, [client, targetID]);

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

            setTimeout(() => {
                client.publish({
                    destination: `/topic/message/${targetid}`,
                    body: JSON.stringify(messageData),
                });
            }, 3000);

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

    const handleGetFullMessage = (FlowMessageId, UserTargetId) => {
        baseAxios.post('/chat/details', {
            UserTargetId: UserTargetId,
            UserTargetName: "",
            FlowMessageId: FlowMessageId,
            LastMessage: "",
            images: null,
        }).then((res) => {
            setMessages(res.data);
            setMessageSocketComplete([]);
        }).catch(err => {
            if (err.status === 400) {
                alert(err.response.data);
            }
        });
    };

    const navChatRender = useCallback(() => {
        if (!profile) return null;
        const lastMessage = messageSocketComplete.length > 0
            ? messageSocketComplete[messageSocketComplete.length - 1]
            : null;

        return _.map(profile, (matchedProfile) => {
            const messageToShow = (lastMessage?.flowMessageId === matchedProfile.flowMessageId)
                ? lastMessage.content
                : matchedProfile.LastMessage;

            const dateToShow = (lastMessage?.flowMessageId === matchedProfile.flowMessageId)
                ? lastMessage.time
                : matchedProfile.LastMessageSentTime;
            const unreadCount = messageSocketComplete[messageSocketComplete.length - 1]?.flowMessageId == matchedProfile.FlowMessageId
                ? 0 : messageSocketComplete.filter(msg => msg.flowMessageId === matchedProfile.FlowMessageId).length;

            const handleClick = () => {
                if(checkroom === null) {
                    setCheckroom(1);
                    setCheckIDRoom(matchedProfile.FlowMessageId);
                    handleGetFullMessage(matchedProfile.FlowMessageId, matchedProfile.UserTargetId);
                    setImageTarget(matchedProfile.images[0]);
                    setNameTarget(matchedProfile.UserTargetName);
                    setTargetID(matchedProfile.UserTargetId);
                    setFlowMessageID(matchedProfile.FlowMessageId);
                }
                else {
                    setCheckroom(1);
                    if(checkidroom !== matchedProfile.FlowMessageId){
                        setCheckIDRoom(matchedProfile.FlowMessageId);
                        handleGetFullMessage(matchedProfile.FlowMessageId, matchedProfile.UserTargetId);
                        setImageTarget(matchedProfile.images[0]);
                        setNameTarget(matchedProfile.UserTargetName);
                        setTargetID(matchedProfile.UserTargetId);
                        setFlowMessageID(matchedProfile.FlowMessageId);
                    }
                }
            };

            return (
                <div key={matchedProfile.FlowMessageId}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
                        <div style={{ flex: 1 }}>
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
                                        <Typography style={{ color: "#888888", fontSize: "13px", marginTop: "8px" }}>{formatDays(dateToShow)}</Typography>
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
                        </div>
                    <div style={{width: "0px" }}>
                        <Button
                            className="ellipsis-button"
                            onClick={() => toggleMenu(matchedProfile.FlowMessageId)}
                        >
                            <MoreVertIcon />
                        </Button>
                        {openMenuId === matchedProfile.FlowMessageId && (
                            <ul className="dropdown-menu">
                                <li className="dropdown-item" onClick={() => deleteMatches(matchedProfile.FlowMessageId)}>Hủy ghép đôi</li>
                            </ul>
                        )}
                    </div>
                    <Divider variant="inset" component="li" />
                    </div>
                </div>
            );
        });
    }, [profile, messageSocketComplete, openMenuId]);

    useEffect(() => {
        navChatRender();
    }, [profile, messageSocketComplete, openMenuId]);

    if (_.isEmpty(matchList)) {
        return (
            <Box className="emptyChat">
                <span role="img" aria-label="emoji" className="emptyChatTitle">
                    Hiện tại bạn chưa ghép đôi với đối tượng hẹn hò nào. Nhưng đừng lo, điều đó sẽ đến sớm thôi 😌
                </span>
                <img src="https://media.giphy.com/media/Az1CJ2MEjmsp2/giphy.gif" alt="lonely ghost town gif" />
            </Box>
        );
    }

    return (
        <>
            {videoCallInfo && (
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
                            <Avatar alt="Avatar" src={videoCallInfo?.image} style={{ width: "60px", height: "60px" }} />
                            <Typography style={{ color: "#575757", fontSize: "17px", marginTop: "5px" }}>{videoCallInfo?.name}</Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button
                            autoFocus
                            style={{ border: "1px solid #000", padding: "6px 12px", marginTop: "-20px", borderRadius: "20px", color: "white", backgroundColor: "#2f7cd3" }}
                            onClick={() => {
                                window.open(`https://present-ghastly-puma.ngrok-free.app/?id=${videoCallInfo?.targetid}&idtarget=${videoCallInfo?.userid}`, "_blank");
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
                                        src={imageTarget}
                                        className="avatarchatroom"
                                    />
                                    <Typography variant="h5">{nameTarget}</Typography>
                                </Link>
                            </Box>
                        </Box>
                        <Box className="chatContent" id="chat" ref={chatRef}>
                            {messages?.content && Object.entries(messages.content).map(([id, userMessages]) => {
                                if (userMessages.userid !== messages.userIdCurrent) {
                                    return (
                                        <Box key={`${userMessages.time}-${id}`} className="boxMessageOther">
                                            <Avatar alt="Avatar" src={imageTarget} />
                                            <div className="textBubbleOther">
                                                {userMessages.content && <div>{userMessages.content}</div>}
                                                {userMessages.image && (
                                                    <img
                                                        src={userMessages.image}
                                                        alt="Shared image"
                                                        style={{
                                                            maxWidth: '200px',
                                                            maxHeight: '200px',
                                                            borderRadius: '8px',
                                                            marginTop: '5px',
                                                            marginBottom: '5px'
                                                        }}
                                                    />
                                                )}
                                                <Typography style={{ color: "#888888", fontSize: "13px" }}>
                                                    {formatDate(userMessages.time)}
                                                </Typography>
                                            </div>
                                        </Box>
                                    );
                                }
                                return (
                                    <Box key={`${userMessages.time}-${id}`} className="boxMessageMe">
                                        <div className="textBubbleMe">
                                            {userMessages.content && <div>{userMessages.content}</div>}
                                            {userMessages.image && (
                                                <img
                                                    src={userMessages.image}
                                                    alt="Shared image"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        borderRadius: '8px',
                                                        marginTop: '5px',
                                                        marginBottom: '5px'
                                                    }}
                                                />
                                            )}
                                            <Typography style={{ color: "#888888", fontSize: "13px" }}>
                                                {formatDate(userMessages.time)}
                                            </Typography>
                                        </div>
                                        <Avatar alt="Avatar" src={homepageData.images[0]} />
                                    </Box>
                                );
                            })}
                            {messageSocketComplete && messages &&
                                messageSocketComplete.map((message) => {
                                    if (message.targetID !== messages.userIdCurrent && message.flowMessageId == messages.flowMessageId) {
                                        return (
                                            <Box key={message.time} className="boxMessageMe">
                                                <div className="textBubbleMe">
                                                    {message.content && <div>{message.content}</div>}
                                                    {message.image && (
                                                        <img
                                                            src={message.image}
                                                            alt="Shared image"
                                                            style={{
                                                                maxWidth: '200px',
                                                                maxHeight: '200px',
                                                                borderRadius: '8px',
                                                                marginTop: '5px',
                                                                marginBottom: '5px'
                                                            }}
                                                        />
                                                    )}
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
                                                <Avatar alt="Avatar" src={imageTarget} />
                                                <div className="textBubbleOther">
                                                    {message.content && <div>{message.content}</div>}
                                                    {message.image && (
                                                        <img
                                                            src={message.image}
                                                            alt="Shared image"
                                                            style={{
                                                                maxWidth: '200px',
                                                                maxHeight: '200px',
                                                                borderRadius: '8px',
                                                                marginTop: '5px',
                                                                marginBottom: '5px'
                                                            }}
                                                        />
                                                    )}
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
                                        value={messageSend}
                                        fullWidth
                                        type="text"
                                        name="message"
                                        variant="outlined"
                                        className="textFieldChatroom"
                                        onChange={(e) => setMessageSend(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                const now = new Date().toLocaleString();
                                                sendMessage(flowMessageID, targetID, messageSend, null, now);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item sm={2} xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        <ChatImageUploader
                                            onImageUploaded={(imageUrl) => {
                                                const now = new Date().toLocaleString();
                                                sendMessage(flowMessageID, targetID, null, imageUrl, now);
                                            }}
                                            disabled={!checkroom}
                                        />
                                        <Button variant="contained" style={{ marginLeft: 5 }} onClick={() => {
                                            const now = new Date().toLocaleString();
                                            sendMessage(flowMessageID, targetID, messageSend, null, now);
                                        }}>
                                            <SendIcon />
                                        </Button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            variant="contained"
                                            style={{ marginTop: 5 }}
                                            onClick={() => {
                                                window.open(`https://present-ghastly-puma.ngrok-free.app/?id=${homepageData.userid}`, "_blank");
                                                sendVideoCallInfo(homepageData.userid, messages.UserIdTarget, homepageData.name, homepageData.images[0]);
                                            }}
                                        >
                                            <VideocamIcon />
                                        </Button>
                                    </div>
                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                ) : (
                    <Box className="emptychatWrapper">
                        <div style={{ transform: 'translateY(800%)', textAlign: 'center' }}>
                            Hãy chọn đối tượng hẹn hò để tiến hành trò chuyện với họ!
                        </div>
                    </Box>
                )}
            </Stack>
        </>
    );
};

export default Chat;
