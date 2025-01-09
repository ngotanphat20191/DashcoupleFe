import React from 'react';
import {Grid, Typography, Box, TextField, Button} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CurrentPictures from './current-pictures.jsx';
import FormCheckBox from './formCheckBox.jsx';
import InputTextShort from './inputTextShort.jsx';
import '../profile.css'
import './upperBoxProfile.css'

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}
const TabPanelProfileAbout = ({ value, index, profile }) => {
    return (
        <TabPanel value={value} index={index}>
            <Grid container>
                <Grid item sm={8} className="gridColumnProfile">
                    <FormCheckBox
                        title="Gender"
                        name="gender"
                        label={['Woman', 'Man']}
                    />
                    <FormCheckBox
                        title="I am looking for"
                        name="sexualOrientation"
                        label={['Woman', 'Man']}
                    />
                    <InputTextShort
                        Typography={Typography}
                        Box={Box}
                        TextField={TextField}
                        profile={profile}
                        name="description"
                        value={profile.description}
                        title="My self-summary"
                        type="text"
                    />
                    <Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="medium"
                        >
                            Save changes
                        </Button>
                    </Box>
                </Grid>
                <Grid item sm={4} className="gridColumnProfile">
                    <Typography variant="subtitle1">
                        <Box fontWeight="fontWeightBold">My pictures</Box>
                    </Typography>
                    <Grid container>
                        <Grid item xsm={12} className="gridPicturesWrapper">
                            <CurrentPictures
                                Grid={Grid}
                                pictures={profile.images}
                                profilePicture={profile.profilePicture}
                                Box={Box}
                                Button={Button}
                            />
                                <Box className="modifyPictureButton">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="button"
                                        size="large"
                                        startIcon={<AddAPhotoIcon />}
                                    >
                                        Upload a picture
                                    </Button>
                                    <input
                                        label="upload file"
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="uploadInputprofile"
                                    />
                                </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </TabPanel>
    );
};

export default TabPanelProfileAbout;
