import React from 'react';
import Typography from '@mui/material/Typography';
import './title.css'
const Title = ({ textTitle }) => {
    return (
        <div className="herotitle">
            <Typography variant="h4" color="primary">
                {textTitle}
            </Typography>
        </div>
    );
};

export default Title;