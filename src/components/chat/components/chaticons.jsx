import React, { useState } from 'react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';

// Define a set of icon URLs for common emotions
const ICON_URLS =
[
    '../../../assets/images/laugh.png',
    '../../../assets/images/facebook-reactions.png',
    '../../../assets/images/angry.png',
    '../../../assets/images/sad.png',
    '../../../assets/images/thumbs-up.png',
    '../../../assets/images/heart.png',
    '../../../assets/images/cool.png',
    '../../../assets/images/think.png',
    '../../../assets/images/hug.png',
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
                    marginLeft: 1,
                    marginRight: 1
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