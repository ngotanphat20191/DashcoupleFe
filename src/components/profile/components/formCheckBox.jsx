import React from 'react';
import {Typography, Box, FormControlLabel, FormControl, FormGroup, Checkbox} from '@mui/material';
import '../profile.css'
const formCheckBox = ({title, name, label}) => {
    const check = false;
    if (label) {
        return (
            <>
                <Typography variant="subtitle1">
                    <Box fontWeight="fontWeightBold">{title}</Box>
                </Typography>
                <FormControl component="fieldset" className="formControlprofile">
                    <FormGroup row>
                        {label.map((checkbox, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={check}
                                        name={name}
                                        value={(index + 1).toString(10)}
                                    />
                                }
                                label={label[index]}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </>
        );
    }
};

export default formCheckBox;
