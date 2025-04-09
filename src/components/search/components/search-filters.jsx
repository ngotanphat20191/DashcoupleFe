import {Autocomplete, TextField, Typography, Slider, Stack} from '@mui/material';
import '../search.css';
import React from "react";
const sortOptions = [
    {
        value: 'score',
        label: 'Điểm phù hớp',
    },
    {
        value: 'distance',
        label: 'Khoảng cách',
    },
    {
        value: 'ageAsc',
        label: 'Tuổi: từ nhỏ đến lớn',
    },
    {
        value: 'ageDesc',
        label: 'Tuổi: từ lớn đến nhỏ',
    },
    {
        value: 'interests',
        label: 'sở thích',
    },
];

const SearchFilters = ({preference, interestNames, religionNames, setpreference}) => {

    const [ageRange, setageRange] = React.useState([preference.preferenceRecord.preferenceAgeMin,preference.preferenceRecord.preferenceAgeMax]);
    const handleAgeChange = (event, newageRange) => {
        setageRange(newageRange);
    };
    return (
        <Stack className="filtersContainerSuggest" direction="row" justifyContent="space-between" >
            <div>
                <Typography
                    id="discrete-slider"
                    className="titleGutterbottom"
                    align="center"
                >
                    Tuổi
                </Typography>
                <Slider
                    className="slidersearch"
                    valueLabelDisplay="auto"
                    value={ageRange}
                    onChange={handleAgeChange}
                    aria-labelledby="range-slider"
                    getAriaValueText={value => `${value} kms`}
                    min={18}
                    max={60}
                    style={{paddingTop:"30px"}}
                />
            </div>
            <div>
                <Typography
                    id="discrete-slider"
                    className="titleGutterbottom"
                    align="center"
                >
                    Sở thích
                </Typography>
                <div className="interestChipsSearch">
                    <div>
                        <Autocomplete
                            className="slidersearch"
                            multiple
                            options={interestNames}
                            getOptionLabel={(option) => option.name}
                            sx={{
                                width: '100%',
                                backgroundColor: 'white',
                                '.MuiAutocomplete-tag': {
                                    fontSize: '14px',
                                    padding: '2px 6px',
                                    height: '24px'
                                },
                                '.MuiInputBase-root': {
                                    minHeight: '32px',
                                    fontSize: '14px'
                                },
                                '.MuiOutlinedInput-root': {
                                    padding: '4px'
                                }
                            }}
                            value={interestNames.filter(interest =>
                                preference?.interests.includes(interest.InterestID)
                            )}
                            onChange={(event, newValue) => {
                                const selectedIds = newValue.map(interest => interest.InterestID);
                                setpreference({ ...preference, preferenceInterest: selectedIds });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Thêm sở thích"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            <div>
                <Typography
                    id="discrete-slider"
                    className="titleGutterbottomSuggest"
                    align="center"
                >
                    Tôn giáo
                </Typography>
                <div className="interestChipsSuggest">
                    <Autocomplete
                        className="sliderSuggest"
                        disablePortal
                        options={religionNames}
                        value={preference.preferenceRecord.preferenceLocation}
                        getOptionLabel={option => option.title}
                        sx={{ width: 200 }}
                        renderInput={(params) =>
                            <TextField {...params} variant="outlined" placeholder="Thêm tôn giáo" fullWidth/>}
                    />
                </div>
            </div>
            <div>
                <form className="container" noValidate autoComplete="off" style={{width: "150%", paddingRight:"50px"}}
                >
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottom"
                        align="center"
                        style={{marginTop: "4px"}}
                    >
                        Sắp xếp theo
                    </Typography>
                    <TextField
                        id="outlined-select-currency-native"
                        select
                        className="textFieldsearch"
                        value="score"
                        fullWidth
                        SelectProps={{
                            native: true,
                            MenuProps: {
                                className: "menuItemSearch",
                            },
                        }}
                        variant="outlined">
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </form>
            </div>
        </Stack>
    );
};
export default SearchFilters;
