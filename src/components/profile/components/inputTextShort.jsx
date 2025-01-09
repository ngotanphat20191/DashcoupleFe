import React from 'react';
import '../profile.css'
import './upperBoxProfile.css'

const InputTextShort = ({Typography, Box, TextField, profile, name, value, title, type,}) => {
    if (type === 'date') {
        return (
            <div className="formControlprofile">
                <Typography variant="subtitle1">
                    <Box fontWeight="fontWeightBold">{title}</Box>
                </Typography>
                <TextField
                    className="textFieldprofile"
                    margin="normal"
                    variant="outlined"
                    name={name}
                    value={value}
                    type={type}
                />
            </div>
        );
    }
    if (name === 'description') {
        return (
            <div className="formControlprofile">
                <Typography variant="subtitle1">
                    <Box fontWeight="fontWeightBold">{title}</Box>
                </Typography>
                <TextField
                    className="summaryFieldprofile"
                    margin="normal"
                    variant="outlined"
                    name={name}
                    value={value}
                    type={type}
                    multiline
                    rows="4"
                />
            </div>
        );
    }
    return (
        <div className="formControlprofile">
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{title}</Box>
            </Typography>
            <TextField
                className="textFieldprofile"
                margin="normal"
                variant="outlined"
                name={name}
                value={value}
                type={type}
            />
        </div>
    );
};

export default InputTextShort;
