import {Autocomplete, TextField, Typography, Slider, Stack, Paper} from '@mui/material';
import '../suggestions.css';
import React, {useEffect} from "react";

const sortOptions = [
    {
        value: 'normal',
        label: 'Mặc định',
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
        value: 'alphabet',
        label: 'Tên',
    },
];
const thanhpho = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
    "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
    "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];
const SuggestionsFilters = ({preference, interestNames, religionNames, setpreference, onSortChange}) => {
    const tongiao = ['Phật giáo', 'Thiên chúa giáo', 'Kito giáo', 'Hindu giáo', 'Hồi giáo'];
    const [ageRange, setAgeRange] = React.useState([
        preference?.preferenceRecord?.preferenceAgeMin || 18,
        preference?.preferenceRecord?.preferenceAgeMax || 60
    ]);
    const [selectedSort, setSelectedSort] = React.useState('normal');
    const [selectedReligion, setSelectedReligion] = React.useState(
        preference?.preferenceRecord?.preferenceLocation || null
    );
    const [selectedCity, setSelectedCity] = React.useState(
        preference?.preferenceRecord?.preferenceCity || null
    );

    // Update age range in preference when it changes
    useEffect(() => {
        if (preference && ageRange) {
            const updatedPreference = {
                ...preference,
                preferenceRecord: {
                    ...preference.preferenceRecord,
                    preferenceAgeMin: ageRange[0],
                    preferenceAgeMax: ageRange[1]
                }
            };
            setpreference(updatedPreference);
        }
    }, [ageRange]);

    useEffect(() => {
        if (preference && selectedReligion !== undefined) {
            const updatedPreference = {
                ...preference,
                preferenceRecord: {
                    ...preference.preferenceRecord,
                    preferenceLocation: selectedReligion
                }
            };
            setpreference(updatedPreference);
        }
    }, [selectedReligion]);
    
    useEffect(() => {
        if (preference && selectedCity !== undefined) {
            const updatedPreference = {
                ...preference,
                preferenceRecord: {
                    ...preference.preferenceRecord,
                    preferenceCity: selectedCity
                }
            };
            setpreference(updatedPreference);
        }
    }, [selectedCity]);

    const handleAgeChange = (event, newAgeRange) => {
        setAgeRange(newAgeRange);
    };

    const handleSortChange = (event) => {
        const newValue = event.target.value;
        setSelectedSort(newValue);
        
        if (onSortChange) {
            onSortChange(newValue);
        }
    };

    const handleReligionChange = (event, newValue) => {
        setSelectedReligion(newValue);
    };
    
    const handleCityChange = (event, newValue) => {
        setSelectedCity(newValue);
    };

    return (
        <Paper elevation={2} sx={{ 
            width: '95%',
            padding: '15px',
            margin: '10px',
            borderRadius: '15px',
            backgroundColor: '#fff5fd'
        }}>
            <Stack direction="row" justifyContent="space-between" >
                <div>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottom"
                        align="center"
                        fontWeight="bold"
                    >
                        Tuổi
                    </Typography>
                    <Slider
                        className="slidersearch"
                        valueLabelDisplay="auto"
                        value={ageRange}
                        onChange={handleAgeChange}
                        aria-labelledby="range-slider"
                        getAriaValueText={value => `${value} tuổi`}
                        min={18}
                        max={60}
                        style={{width: '150px'}}
                        sx={{
                            color: '#fc6ae7',
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#fc6ae7',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: '#ffb8f1',
                            }
                        }}
                    />
                    <Typography variant="caption" display="block" textAlign="center">
                        {ageRange[0]} - {ageRange[1]} tuổi
                    </Typography>
                </div>
                <div>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottom"
                        align="center"
                        fontWeight="bold"
                    >
                        Sở thích
                    </Typography>
                    <div className="interestChipsSearch">
                        <div>
                            <Autocomplete
                                className="slidersearch"
                                multiple
                                options={interestNames || []}
                                getOptionLabel={(option) => option.name}
                                sx={{
                                    width: '150px',
                                    margin: '0px 20px',
                                    '.MuiAutocomplete-tag': {
                                        fontSize: '14px',
                                        padding: '2px 6px',
                                        height: '24px',
                                        backgroundColor: '#ffb8f1',
                                        color: '#333'
                                    },
                                    '.MuiInputBase-root': {
                                        minHeight: '32px',
                                        fontSize: '14px'
                                    },
                                    '.MuiOutlinedInput-root': {
                                        padding: '4px'
                                    }
                                }}
                                value={
                                    interestNames?.filter(interest =>
                                        preference?.preferenceInterest?.some(
                                            id => parseInt(id, 10) === parseInt(interest.InterestID, 10)
                                        )
                                    ) || []
                                }
                                onChange={(event, newValue) => {
                                    const selectedIds = newValue.map(interest => parseInt(interest.InterestID, 10));
                                    setpreference({ ...preference, preferenceInterest: selectedIds });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Thêm sở thích"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#fc6ae7',
                                                },
                                            },
                                        }}
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
                        fontWeight="bold"
                        sx={{marginBottom: "10px"}}
                    >
                        Tôn giáo
                    </Typography>
                    <div className="interestChipsSuggest">
                        <Autocomplete
                            className="sliderSuggest"
                            disablePortal
                            options={tongiao}
                            value={selectedReligion}
                            onChange={handleReligionChange}
                            getOptionLabel={option => option}
                            sx={{
                                width: '150px',
                                '.MuiAutocomplete-tag': {
                                    fontSize: '14px',
                                    padding: '2px 6px',
                                    height: '24px',
                                    backgroundColor: '#ffb8f1',
                                    color: '#333'
                                },
                                '.MuiInputBase-root': {
                                    minHeight: '32px',
                                    fontSize: '14px'
                                },
                                '.MuiOutlinedInput-root': {
                                    padding: '4px'
                                }
                            }}
                            renderInput={(params) =>
                                <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Chọn tôn giáo" 
                                    fullWidth
                                />
                            }
                        />
                    </div>
                </div>
                <div>
                    <Typography
                        id="discrete-slider"
                        className="titleGutterbottomSuggest"
                        align="center"
                        fontWeight="bold"
                        sx={{marginBottom: "10px"}}
                    >
                        Thành phố
                    </Typography>
                    <div className="interestChipsSuggest">
                        <Autocomplete
                            className="sliderSuggest"
                            disablePortal
                            options={thanhpho}
                            value={selectedCity}
                            onChange={handleCityChange}
                            getOptionLabel={option => option}
                            sx={{
                                width: '150px',
                                '.MuiAutocomplete-tag': {
                                    fontSize: '14px',
                                    padding: '2px 6px',
                                    height: '24px',
                                    backgroundColor: '#ffb8f1',
                                    color: '#333'
                                },
                                '.MuiInputBase-root': {
                                    minHeight: '32px',
                                    fontSize: '14px'
                                },
                                '.MuiOutlinedInput-root': {
                                    padding: '4px'
                                }
                            }}
                            renderInput={(params) =>
                                <TextField 
                                    {...params} 
                                    variant="outlined" 
                                    placeholder="Chọn thành phố" 
                                    fullWidth
                                />
                            }
                        />
                    </div>
                </div>
                <div>
                    <form className="container" noValidate autoComplete="off">
                        <Typography
                            id="discrete-slider"
                            className="titleGutterbottom"
                            align="center"
                            fontWeight="bold"
                            style={{marginBottom: "13px"}}
                        >
                            Sắp xếp theo
                        </Typography>
                        <TextField
                            size="small"
                            id="outlined-select-currency-native"
                            select
                            className="textFieldsearch"
                            value={selectedSort}
                            sx={{
                                width: '150px',
                                '.MuiAutocomplete-tag': {
                                    fontSize: '14px',
                                    padding: '2px 6px',
                                    height: '24px',
                                    backgroundColor: '#ffb8f1',
                                    color: '#333'
                                },
                                '.MuiInputBase-root': {
                                    minHeight: '32px',
                                    fontSize: '14px'
                                },
                                '.MuiOutlinedInput-root': {
                                    padding: '4px'
                                }
                            }}
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
        </Paper>
    );
};

export default SuggestionsFilters;
