import React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Fab from '@mui/material/Fab';
import '../profile.css'
const CurrentPictures = ({pictures, Grid, Box, profilePicture,}) => {
    if (pictures) {
        return pictures.map(pictureUrl => (
            <Grid
                key={pictureUrl}
                item
                xs={6}
                sm={4}
                xl={4}
                className="pictureContainerprofile"
            >
                <img
                    src={pictureUrl}
                    alt="My profile"
                    width="100%"
                    className={
                        profilePicture === pictureUrl
                            ? "profilePicture"
                            : "pictureprofile"
                    }
                />
                <Fab
                    color="secondary"
                    size="small"
                    className="deleteButtonPicture"
                >
                    <HighlightOffIcon name={pictureUrl} value={pictureUrl} />
                </Fab>
            </Grid>
        ));
    }
    return (
        <Grid container xs={6} sm={6} className="pictureContainerprofile">
            <Box
                bgcolor="secondary.main"
                width="100%"
                className="modifyPictureButton"
            >
                <p>Aucune photo</p>
            </Box>
        </Grid>
    );
};
export default CurrentPictures;
