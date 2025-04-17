import {Fragment, useState} from 'react';
import moment from 'moment';
import {List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography} from '@mui/material';
import _ from 'lodash';
import '../nav.css'
const NotificationDrawer = ({ toggleDrawer, notifications }) => {
    const [notifLink, setnotifLink] = useState(null);
    const messageToDisplay = (type, content) => {
        let message = '';
        if (type) {
            switch (type) {
                case 'Like':
                    message = `${content}`;
                    break;
                case 'Create':
                    message = `${content}`;
                    break;
                case 'Delete':
                    message = `${content}`;
                    break;
                case 'Chat':
                    message = `${content}`;
                    break;
                default:
            }
            return message;
        }
    };
    function handleNotificationLink(data) {
       if(data === 'Like') {setnotifLink('/likes')};
       if(data === 'Create') {setnotifLink('/chat')};
       if(data === 'Delete') {setnotifLink('/suggestions')};
       if(data === 'Chat') {setnotifLink('/chat')};
    }
    return (
        <div
            className="list"
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            {_.isEmpty(notifications) ? (
                <Typography className="noNotificationsDrawer">
          <span role="img" aria-label="emoji">
              Hiện tại bạn chưa có thông báo nào cả, hãy cố gắng lên 😌
          </span>
                </Typography>
            ) : (
                <List>
                    {notifications.map(notification => {
                        return (
                            <Fragment key={notification.createTime}>
                                <ListItem
                                    button
                                    component="a"
                                    href={notifLink}
                                    className={notification.is_read === 1 ? null : "notReadNotif"}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt="avatar" src={notification.image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={messageToDisplay(
                                            notification.type,
                                            notification.content,
                                        )}
                                        secondary={moment(notification.createTime).fromNow()}
                                    />
                                </ListItem>
                                <Divider />
                            </Fragment>
                        );
                    })}
                </List>
            )}
        </div>
    );
};

export default NotificationDrawer;
