import React, { useState } from 'react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import laughicon from '../../../assets/images/laugh.png'
import angryicon from '../../../assets/images/angry.png'
import sadicon from '../../../assets/images/sad.png'
import thumbupicon from '../../../assets/images/thumbs-up.png'
import hearticon from '../../../assets/images/heart.png'
import coolicon from '../../../assets/images/cool.png'
import thinkhicon from '../../../assets/images/think.png'
import hugicon from '../../../assets/images/hug.png'

const ICON_URLS =
[
    laughicon,
    angryicon,
    sadicon,
    thumbupicon,
    hearticon,
    coolicon,
    thinkhicon,
    hugicon,
];

const ChatIconSelector = ({ onIconSelected, disabled }) => {
    const [showIconPicker, setShowIconPicker] = useState(false);

    // Handle opening the icon picker
    const handleOpenIconPicker = () => {
        setShowIconPicker(true);
    };

    // Handle closing the icon picker
    const handleCloseIconPicker = () => {
        setShowIconPicker(false);
    };

    // Handle selecting an icon
    const handleSelectIcon = (iconUrl) => {
        onIconSelected(iconUrl);
        setShowIconPicker(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenIconPicker}
                disabled={disabled}
                sx={{
                    color: 'white',
                    marginLeft: "5px",
                    marginTop: "5px"
                }}
            >
                <EmojiEmotionsIcon />
            </Button>

            <Dialog open={showIconPicker} onClose={handleCloseIconPicker} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Chọn biểu tượng cảm xúc
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseIconPicker}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {ICON_URLS.map((iconUrl, index) => (
                            <Grid item xs={3} key={index}>
                                <img
                                    src={iconUrl}
                                    alt={`Icon ${index + 1}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                    }}
                                    onClick={() => handleSelectIcon(iconUrl)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseIconPicker} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChatIconSelector;