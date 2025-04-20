import { useState, useEffect } from 'react';
import {FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
const EditBirthday = ({ formData, setFormData }) => {
        const [birthday, setBirthday] = useState({month: '', day: '', year: '',});
        const months = [
            { label: 'Thang 1', value: 1 },
            { label: 'Thang 2', value: 2 },
            { label: 'Thang 3', value: 3 },
            { label: 'Thang 4', value: 4 },
            { label: 'Thang 5', value: 5 },
            { label: 'Thang 6', value: 6 },
            { label: 'Thang 7', value: 7 },
            { label: 'Thang 8', value: 8 },
            { label: 'Thang 9', value: 9 },
            { label: 'Thang 10', value: 10 },
            { label: 'Thang 11', value: 11 },
            { label: 'Thang 12', value: 12 },
        ];
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 123 }, (_, i) => currentYear - i);
        const handleChange = (field) => (event) => {
            setBirthday((prev) => ({
                ...prev,
                [field]: event.target.value,
            }));
        };
        useEffect(() => {
            if (birthday.day && birthday.month && birthday.year) {
                setFormData({
                    ...formData,
                    birthday: `${birthday.year}-${birthday.month}-${birthday.day}`,
                });
            }
        }, [birthday, setFormData]);
        return (
            <Box sx={{ display: 'flex', flexDirection: 'row', maxWidth: 400, marginBottom: '20px' }}>
                <FormControl fullWidth  sx={{ backgroundColor: 'white'}}>
                    <InputLabel>{birthday.day ? '' : 'Ngày'}</InputLabel>
                    <Select value={birthday.day} onChange={handleChange('day')} sx={{ height: 50, width: 80 }}>
                        {days.map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ backgroundColor: 'white'}}>
                    <InputLabel>{birthday.month ? '' : 'Tháng'}</InputLabel>
                    <Select value={birthday.month} onChange={handleChange('month')} sx={{ marginLeft: '-30px', height: 50, width: 125 }}>
                        {months.map((m) => (
                            <MenuItem key={m.value} value={m.value}>
                                {m.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ backgroundColor: 'white'}}>
                    <InputLabel sx={{}}>{birthday.year ? '' : 'Năm'}</InputLabel>
                    <Select value={birthday.year} onChange={handleChange('year')} sx={{ marginLeft: '-15px', height: 50, width: 100 }}>
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
   );
}
export default EditBirthday;