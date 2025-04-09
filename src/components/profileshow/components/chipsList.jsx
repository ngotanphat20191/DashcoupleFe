import React from 'react';
import {Chip, Box} from '@mui/material';
import '../profileshow.css';
const findEquivalence = number => {
    let label;

    switch (number) {
        case 1:
            label = 'Woman';
            break;
        case 2:
            label = 'Man';
            break;
        default:
            label = label
            break;
    }
    return label;
};

const ChipsList = ({list, type }) => {
    if (list) {
        if (type === 'gender' || type === 'preference') {
            return (
                <Box className="genderChips">
                    {list.map(item => (
                        <Chip key={item} label={findEquivalence(item)} />
                    ))}
                </Box>
            );
        }
        return (
            <Box className="genderChips">
                {list.map(item => (
                    <Chip key={item} label={findEquivalence(item)} />
                ))}
            </Box>
        );
    }
};

export default ChipsList;
