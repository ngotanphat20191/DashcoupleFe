import React from 'react';
import {Autocomplete, TextField, Typography, Slider, Grid} from '@mui/material';
import '../search.css'
const sortOptions = [
    {
        value: '',
        label: '',
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

const SearchFilters = ({searchOptions, interestNames}) => {
    return (
        <div className="filtersContainersearch">
            <Grid container spacing={5} direction="row" justify="center">
                <Grid item sm={2} xs={6}>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottom"
                        align="center"
                    >
                        Age
                    </Typography>
                    <Slider
                        className="slidersearch"
                        value={searchOptions.ageRange}
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
                        className="titleGutterbottom"
                        align="center"
                    >
                        Popularity
                    </Typography>
                    <Slider
                        className="slidersearch"
                        value={searchOptions.popularityRange}
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
                        className="titleGutterbottom"
                        align="center"
                    >
                        Interests
                    </Typography>
                    <div className="interestChipsSearch">
                        <div>
                            <Autocomplete
                                className="slidersearch"
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
                            className="titleGutterbottom"
                            align="center"
                        >
                            Sort by
                        </Typography>
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            className="textFieldsearch"
                            value={searchOptions.sort}
                            fullWidth
                            SelectProps={{
                                native: true,
                                MenuProps: {
                                    className: "menuItemSearch",
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
export default SearchFilters;

