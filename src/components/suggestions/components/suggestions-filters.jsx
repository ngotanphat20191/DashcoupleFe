import {Autocomplete, TextField, Typography, Slider, Grid} from '@mui/material';
import React from 'react';
import '../suggestions.css';
const sortOptions = [
    {
        value: 'score',
        label: 'Matching score',
    },
    {
        value: 'distance',
        label: 'Distance',
    },
    {
        value: 'ageAsc',
        label: 'Age: Low to high',
    },
    {
        value: 'ageDesc',
        label: 'Age: High to low',
    },
    {
        value: 'popularity',
        label: 'Popularity',
    },
    {
        value: 'interests',
        label: 'Interests',
    },
];

const SuggestionsFilters = ({suggestionsOptions, interestNames,}) => {
    return (
        <div className="filtersContainerSuggest">
            <Grid container spacing={5} direction="row" justify="center">
                <Grid item sm={2} xs={6}>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottomSuggest"
                        align="center"
                    >
                        Age
                    </Typography>
                    <Slider
                        className="sliderSuggest"
                        value={suggestionsOptions.ageRange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={value => `${value} kms`}
                        min={18}
                        max={60}
                    />
                </Grid>
                <Grid item sm={2} xs={6}>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottomSuggest"
                        align="center"
                    >
                        Popularity
                    </Typography>
                    <Slider
                        className="sliderSuggest"
                        value={suggestionsOptions.popularityRange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={value => `${value} kms`}
                        min={0}
                        max={100}
                    />
                </Grid>
                <Grid item sm={2} xs={6}>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottomSuggest"
                        align="center"
                    >
                        Interests
                    </Typography>
                    <div className="interestChipsSuggest">
                        <div>
                            <Autocomplete
                                className="sliderSuggest"
                                multiple
                                options={interestNames}
                                getOptionLabel={option => option.name}
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
                </Grid>
                <Grid item sm={2} xs={6}>
                    <form className="container" noValidate autoComplete="off">
                        <Typography
                            id="discrete-slider"
                            className="titleGutterbottomSuggest"
                            align="center"
                        >
                            Sort by
                        </Typography>
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            className="textField"
                            value={suggestionsOptions.sort}
                            fullWidth
                            SelectProps={{
                                native: true,
                                MenuProps: {
                                    className: "menuItemSugget",
                                },
                            }}
                            variant="outlined"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};
export default SuggestionsFilters;
