import Typography from '@mui/material/Typography';
import React, {useEffect, useRef} from "react";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import InterestsIcon from '@mui/icons-material/Interests';
import {ArrowForward} from "@mui/icons-material";

const ProfileInterest = ({ interests, containerRef, formData, setFormData }) => {
    const [value, setValue] = React.useState([]);
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
    const listInterest = (anchor) => (
        <div>
            <Typography  sx={{
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "2rem",
                fontSize: "15px",
                paddingBottom:"10px"
            }}>Hãy chọn 5 sở thích mà bạn nghĩ là bạn có, điều này giúp tăng khả năng ghép đôi phù hợp</Typography>
            <Sheet variant="outlined" sx={{ width: 360, p: 2, borderRadius: 'sm' }}>
                <div role="group" aria-labelledby="rank">
                    <List
                        orientation="horizontal"
                        wrap
                        sx={{
                            '--List-gap': '8px',
                            '--ListItem-radius': '20px',
                            '--ListItem-minHeight': '32px',
                            '--ListItem-gap': '4px',
                        }}
                    >
                        {interests && interests.map((item) => (
                            <ListItem key={item.InterestID}>
                                {formData.interest.includes(Number(item.InterestID)) && (
                                    <Done
                                        fontSize="md"
                                        color="primary"
                                        sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                    />
                                )}
                                <Checkbox
                                    size="sm"
                                    disableIcon
                                    overlay
                                    label={item.name}
                                    checked={formData.interest.includes(Number(item.InterestID))}
                                    variant={formData.interest.includes(Number(item.InterestID)) ? 'soft' : 'outlined'}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            // Ensure that the number of interests does not exceed 5
                                            if (formData.interest.filter((interest) => interest !== null).length >= 5) {
                                                alert("You can only select up to 5 interests!");
                                                return;
                                            }
                                            // Add the selected interest to the array
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                interest: [...prevData.interest, Number(item.InterestID)],
                                            }));
                                        } else {
                                            // Remove the unchecked interest from the array
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                interest: prevData.interest.filter(
                                                    (id) => id !== Number(item.InterestID)
                                                ),
                                            }));
                                        }
                                    }}
                                    slotProps={{
                                        action: ({ checked }) => ({
                                            sx: checked
                                                ? {
                                                    border: '1px solid',
                                                    borderColor: 'primary.500',
                                                }
                                                : {},
                                        }),
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Sheet>
        </div>
    );
    return(
        <div>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", margin:"5px 0px"}}>Sở thích</Typography>
            {['bottomInterest'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button style={{backgroundColor:'white' ,color:"rgb(124,124,124)", fontWeight: "bold",marginLeft: "-5%",
                        width: "105%", outline: 'none', paddingLeft:"5px", borderBottom: "2px solid rgb(229,232,235)", paddingTop:"10px", borderTop: "2px solid rgb(229,232,235)"}} onClick={toggleDrawer(anchor, true)}>
                        <InterestsIcon  style={{color: 'rgb(245,83,206)' }}></InterestsIcon >
                        <Typography sx={{ fontWeight: "bold", fontSize:"14px", paddingLeft: "2px"}}>Thêm sở thích</Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginLeft:"240px"}}> <ArrowForward className="settings-icon" />
                        </Typography>
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor.replace("Interest", "")}
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
                                maxWidth: 400,
                                borderRadius: "10px",
                            },
                        }}
                    >
                        {listInterest(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    )
}
export default ProfileInterest