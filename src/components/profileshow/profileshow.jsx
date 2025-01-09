import React, { useContext } from 'react';
import {Grid, Divider, Typography, Box, Paper} from '@mui/material';
import Slider from "react-slick";
import _ from 'lodash';
import ChipsList from './components/chipsList.jsx';
import UpperBoxProfile from '../profile/components/upperBoxProfile.jsx';
import './profileshow.css';
import {usermatch} from '../../datas/template.jsx';

const ProfileShow = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    let { username } = useParams();
    return (
        <>
            <UpperBoxProfile
                profile={usermatch}
                type="public"
            />
            <Divider className="dividerprofileshow" />
            <div className="wrapperProfileshow">
                <Grid container>
                    <Grid item sm={6} className="columnPublicProfileshow">
                        <Typography variant="subtitle1" className="itemprofileshow">
                            <Box fontWeight="fontWeightBold">
                                {usermatch.username} identifies as
                            </Box>
                        </Typography>
                        {_.isEmpty(usermatch.gender) ? (
                            <p>No gender defined so far</p>
                        ) : (
                            <ChipsList
                                list={usermatch.gender}
                                type="gender"
                            />
                        )}
                        <Typography variant="subtitle1" className="itemprofileshow">
                            <Box fontWeight="fontWeightBold">
                                {usermatch.username} is looking for
                            </Box>
                        </Typography>
                        {_.isEmpty(usermatch.sexualOrientation) ? (
                            <p>No preference defined so far</p>
                        ) : (
                            <ChipsList
                                list={usermatch.sexualOrientation}
                                type="preference"
                            />
                        )}
                        <Typography variant="subtitle1" className="itemprofileshow">
                            <Box fontWeight="fontWeightBold">
                                {usermatch.username} in a few words
                            </Box>
                        </Typography>
                        <Paper elevation={3} className="summaryprofileshow">
                            {_.isEmpty(usermatch.description) ? (
                                <p>No description defined so far</p>
                            ) : (
                                <p>{usermatch.description}</p>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item sm={6} className="columnPublicProfileshow">
                        <Typography variant="subtitle1" className="itemprofileshow">
                            <Box fontWeight="fontWeightBold">
                                {usermatch.username}'s interests
                            </Box>
                        </Typography>
                        {_.isEmpty(usermatch.interests) ? (
                            <p>No interests defined so far</p>
                        ) : (
                            <ChipsList
                                list={usermatch.interests}
                                type="interests"
                            />
                        )}
                        <Typography variant="subtitle1" className="itemprofileshow">
                            <Box fontWeight="fontWeightBold">
                                {usermatch.username}'s pictures
                            </Box>
                        </Typography>
                        <Slider {...settings} className="carouselprofileshow">
                            {_.isEmpty(usermatch.images) ? (
                                <p>No pictures uploaded so far</p>
                            ) : (
                                usermatch.images.map((image, index) => (
                                    <div key={index} className="slideprofileshow">
                                        <img
                                            className="imageSliderprofileshow"
                                            src={usermatch.images[index]}
                                            alt="profile"
                                        />
                                    </div>
                                ))
                            )}
                        </Slider>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default ProfileShow;
