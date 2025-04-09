import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { RiHeartsFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { GiHighFive } from "react-icons/gi";
import { BsChatLeftHeartFill } from "react-icons/bs";
import {ArrowForward} from "@mui/icons-material";
const relationshipOptions = [
    { label: "Người yêu", icon: <IoHeart style={{color:'pink', fontSize:'25px'}}/> },
    { label: "Bạn bè", icon: <FaUserFriends style={{color:'rgb(44,177,156)', fontSize:'25px'}}/> },
    { label: "Yêu xa", icon: <BsChatLeftHeartFill style={{color:'blue', fontSize:'25px'}}/> },
    { label: "Bạn thân", icon: <GiHighFive style={{color:'green', fontSize:'25px'}}/> },
];
export default function ProfileRelationship({ containerRef, formData, setFormData }) {
    const [state, setState] = React.useState({
        bottom: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const handleSelectRelationship = (anchor, label) => () => {
        setFormData({ ...formData, userRecord: {...prevState.userRecord, relationship: label }});
    };
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <Typography sx={{ fontWeight: "bold", fontSize:"20px", marginTop:"5px", marginBottom:"5px", textAlign: "center"}}>Bạn đang tìm kiếm mối quan hệ gì ?</Typography>
                <Typography sx={{ fontStyle: "italic", fontSize:"15px", marginLeft: "30px", marginRight: "30px" ,marginTop:"5px", marginBottom:"5px", textAlign: "center", color:"rgb(124,124,124)"}}>Nếu bạn chưa chắc về suy nghĩ của mình thì không sao, sẽ luôn có đối tượng hẹn hò phù hợp với bạn</Typography>

                {relationshipOptions.map((h) => (
                    <ListItem key={h.label} disablePadding>
                        <ListItemButton value={formData.userRecord.relationship} onClick={handleSelectRelationship(anchor, h.label)}>
                            <ListItemIcon>
                                {h.icon}
                            </ListItemIcon>
                            <ListItemText primary={h.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    const RelationshipIcon = () => {
        if (!formData.userRecord.relationship) return <RiHeartsFill style={{ color: 'pink', fontSize: '24px' }} />;
        ;
        switch (formData.userRecord.relationship) {
            case 'Người yêu':
                return <RiHeartsFill style={{ color: 'pink', fontSize: '24px' }} />;
            case 'Bạn bè':
                return <FaUserFriends style={{ color: 'rgb(44,177,156)', fontSize: '25px' }} />;
            case 'Bạn thân':
                return <GiHighFive style={{ color: 'green', fontSize: '25px' }} />;
            case 'Yêu xa':
                return <BsChatLeftHeartFill style={{ color: 'blue', fontSize: '25px' }} />;
            default:
                return null;
        }
    };
    return (
        <div>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", margin:"5px 0px"}}>Tìm kiếm mối quan hệ</Typography>
            {['bottom'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button style={{backgroundColor:'white',color:"rgb(124,124,124)", fontWeight: "bold", outline: 'none', paddingLeft:"5px", borderBottom: "2px solid rgb(229,232,235)", paddingTop:"10px", borderTop: "2px solid rgb(229,232,235)", marginLeft: "-5%",
                        width: "105%"}} onClick={toggleDrawer(anchor, true)}>
                        <RelationshipIcon formData={formData} />
                        <Typography sx={{ fontWeight: "bold", fontSize:"14px", paddingLeft: "5px"}}>{formData?.userRecord.relationship ? formData.userRecord.relationship : 'Mối quan hệ'}</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginLeft: formData?.userRecord.relationship ? "285px" : "254px"}}>  <ArrowForward className="settings-icon" /> </Typography>
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                        container={containerRef.current}
                        disablePortal
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                maxWidth: 400, // Prevent it from being too large
                                borderRadius: "10px", // Optional styling
                            },
                        }}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
