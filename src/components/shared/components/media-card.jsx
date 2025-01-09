import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import './media-card.css';
import '../profiles-grid.css';
import '../title.css';
export default function MediaCard({ field, profile, type }) {
    const {
        username,
        location,
        popularityRate,
        profilePicture,
        age,
        liking,
        liked,
        match,
        score,
    } = field;
    const lastVisit = "2 day";
    return (
        <Card className="cardmedia">
            <CardActionArea
                onClick={() => {
                    window.location = `/profile/${username}`;
                }}
            >
                <CardMedia
                    className="media"
                    image={
                        profilePicture ||
                        'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
                    }
                    title={username}
                />
                {type === 'suggestion' ? (
                    <Box className="matchingRate">
                        <Typography>Match rate</Typography>
                        <Typography>{Math.round(score * 100) / 100}%</Typography>
                    </Box>
                ) : null}
                <CardContent
                    className={match === true ? "cardContentMatch" : null}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        align="center"
                        className="titleGutterbottommedia"
                    >
                        {username}{' '}
                        {liked ? (
                            <Tooltip
                                title="This user likes you"
                                aria-label="This user likes you"
                            >
                <span role="img" aria-label="heart emoji">
                  💗
                </span>
                            </Tooltip>
                        ) : null}
                    </Typography>
                    <Typography variant="body2" component="h6" align="center">
                        {age ? age : 'age not defined '}
                        {location ? location : ''}
                    </Typography>
                    {type === 'search' ? null : (
                        <Typography variant="body2" component="h6" align="center">
                            {lastVisit}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
            <Box display="flex" flexDirection="row" justifyContent="center">
                <Avatar className="avatarmedia">{popularityRate}%</Avatar>
                <IconButton
                    aria-label="Like the profile"
                    color={liking ? 'secondary' : 'default'}
                >
                    <FavoriteIcon />
                </IconButton>
            </Box>
        </Card>
    );
}
