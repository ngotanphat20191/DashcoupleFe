import {Autocomplete, TextField, Typography, Slider, Stack} from '@mui/material';
import '../suggestions.css';
import React from "react";
const sortOptions = [
    {
        value: 'score',
        label: 'Điểm phù hợp',
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

const SuggestionsFilters = ({preference, interestNames, religionNames, setpreference}) => {
    const tongiao = ['Phật giáo', 'Thiên chúa giáo', 'Kito giáo', 'Hindu giáo', 'Hồi giáo'];
    const [ageRange, setageRange] = React.useState([preference.preferenceRecord.preferenceAgeMin,preference.preferenceRecord.preferenceAgeMax]);
    const handleAgeChange = (event, newageRange) => {
        setageRange(newageRange);
    };
    const [selectedSort, setSelectedSort] = React.useState('score');
    const handleSortChange = (event) => {
        const newValue = event.target.value;
        setSelectedSort(newValue);
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
                    style={{width: '150px'}}
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
                                width: '300px',
                                margin: '0px 20px',
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
                                preference?.preferenceInterest.includes(interest.InterestID)
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
                        options={tongiao}
                        value={preference.preferenceRecord.preferenceLocation}
                        getOptionLabel={option => option}
                        sx={{ width: 200, marginRight: '20px' }}
                        renderInput={(params) =>
                            <TextField {...params} variant="outlined" placeholder="Thêm tôn giáo" fullWidth/>}
                    />
                </div>
            </div>
            <div>
                <form className="container" noValidate autoComplete="off">
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
                        value={selectedSort}
                        sx={{ width: 200, marginRight: '20px', marginLeft: "10px"}}
                        onChange={handleSortChange}
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
export default SuggestionsFilters;
