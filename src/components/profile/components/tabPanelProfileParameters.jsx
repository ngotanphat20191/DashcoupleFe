import React from 'react';
import {Grid, Typography, Box, TextField, Button, Paper, FormControlLabel, FormControl, FormGroup, Checkbox, Autocomplete} from '@mui/material';
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

const TabPanelProfileParameters = ({ value, index, profile, interests, interestNames, notificationMail, notificationPush, }) => {
    return (
        <TabPanel value={value} index={index}>
            <Box noValidate autoComplete="off">
                <Grid container>
                    <Grid item sm={6} className="gridColumnProfile">
                        <InputTextShort
                            Typography={Typography}
                            Box={Box}
                            TextField={TextField}
                            profile={profile}
                            name="firstname"
                            value={profile.username}
                            title="Firstname"
                            type="text"
                        />
                        <InputTextShort
                            Typography={Typography}
                            Box={Box}
                            TextField={TextField}
                            profile={profile}
                            name="email"
                            value={profile.email}
                            title="Email"
                            type="email"
                        />
                        <Typography variant="subtitle1">
                            <Box fontWeight="fontWeightBold">Location</Box>
                        </Typography>
                        <div className="formControlprofile">
                            {profile.location ? profile.location : null}
                        </div>
                        <InputTextShort
                            Typography={Typography}
                            Box={Box}
                            TextField={TextField}
                            profile={profile}
                            name="age"
                            value={profile.age}
                            title="Age"
                            type="text"
                        />
                    </Grid>
                    <Grid item sm={6} className="gridColumnProfile">
                        <div className="formControlprofile">
                            <Typography variant="subtitle1">
                                <Box fontWeight="fontWeightBold">Interests</Box>
                            </Typography>
                            <div className="interestChips">
                                <div>
                                    <Autocomplete
                                        multiple
                                        options={interestNames}
                                        getOptionLabel={option => option.name}
                                        defaultValue={interests.map(interest => {
                                            return { name: interest };
                                        })}
                                        style={{ width: 300 }}
                                        name="interest"
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Add interest"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <Typography variant="subtitle1">
                            <Box fontWeight="fontWeightBold">Notifications</Box>
                        </Typography>
                        <FormControl component="fieldset" className="formControlprofile">
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notificationMail === true}
                                            name="notificationMail"
                                            value="notificationMail"
                                        />
                                    }
                                    label="Mail"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={notificationPush === true}
                                            name="notificationPush"
                                            value="notificationPush"
                                        />
                                    }
                                    label="Push"
                                />
                            </FormGroup>
                        </FormControl>
                        <Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                            >
                                Save changes
                            </Button>
                        </Box>
                        <Paper className="paperAccountProfile">
                            <Typography variant="h5" component="h5">
                                <Box fontWeight="fontWeightBold">Account security</Box>
                            </Typography>
                            <div>
                                <Box className="divAccountProfile">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="buttonAccountProfile"
                                        size="large"
                                    >
                                        Change password
                                    </Button>
                                </Box>
                                <Box className="divAccountProfile">
                                    <Button
                                        className="buttonAccountProfile"
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                    >
                                        Delete my account
                                    </Button>
                                </Box>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </TabPanel>
    );
};

export default TabPanelProfileParameters;
