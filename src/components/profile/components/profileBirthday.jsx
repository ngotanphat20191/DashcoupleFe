import { useState, useEffect } from 'react';
import {FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const ProfileBirthday = ({ formData, setFormData }) => {
    // Parse the existing birthday from formData if it exists
    const parseBirthdayFromFormData = () => {
        if (formData?.userRecord?.birthday) {
            // Check if the format is yyyy-mm-dd
            if (formData.userRecord.birthday.includes('-')) {
                const [year, month, day] = formData.userRecord.birthday.split('-');
                return {
                    day: parseInt(day, 10),
                    month: parseInt(month, 10),
                    year: parseInt(year, 10)
                };
            } 
            // Check if the format is dd/mm/yyyy
            else if (formData.userRecord.birthday.includes('/')) {
                const [day, month, year] = formData.userRecord.birthday.split('/');
                return {
                    day: parseInt(day, 10),
                    month: parseInt(month, 10),
                    year: parseInt(year, 10)
                };
            }
        }
        return { day: '', month: '', year: '' };
    };

    const [birthday, setBirthday] = useState(parseBirthdayFromFormData());
    
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
    
    // Update birthday state when a field changes
    const handleChange = (field) => (event) => {
        setBirthday((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };
    
    // Update formData when birthday state changes
    useEffect(() => {
        if (birthday.day && birthday.month && birthday.year) {
            // Format as yyyy-mm-dd for database consistency
            const formattedMonth = birthday.month.toString().padStart(2, '0');
            const formattedDay = birthday.day.toString().padStart(2, '0');
            
            setFormData({
                ...formData,
                userRecord: {
                    ...formData.userRecord,
                    birthday: `${birthday.year}-${formattedMonth}-${formattedDay}`,
                }
            });
        }
    }, [birthday, formData, setFormData]);
    
    // Update birthday state if formData changes externally
    useEffect(() => {
        const parsedBirthday = parseBirthdayFromFormData();
        if (
            parsedBirthday.day !== birthday.day || 
            parsedBirthday.month !== birthday.month || 
            parsedBirthday.year !== birthday.year
        ) {
            setBirthday(parsedBirthday);
        }
    }, [formData.userRecord?.birthday]);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', maxWidth: 400, marginBottom: '20px' }}>
            <FormControl fullWidth sx={{ backgroundColor: 'white'}}>
                <InputLabel>{birthday.day ? '' : 'Ngày'}</InputLabel>
                <Select 
                    value={birthday.day || ''} 
                    onChange={handleChange('day')} 
                    sx={{ height: 50, width: 80 }}
                    displayEmpty
                >
                    {days.map((d) => (
                        <MenuItem key={d} value={d}>
                            {d}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ backgroundColor: 'white'}}>
                <InputLabel>{birthday.month ? '' : 'Tháng'}</InputLabel>
                <Select 
                    value={birthday.month || ''} 
                    onChange={handleChange('month')} 
                    sx={{ marginLeft: '-30px', height: 50, width: 125 }}
                    displayEmpty
                >
                    {months.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                            {m.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ backgroundColor: 'white'}}>
                <InputLabel>{birthday.year ? '' : 'Năm'}</InputLabel>
                <Select 
                    value={birthday.year || ''} 
                    onChange={handleChange('year')} 
                    sx={{ marginLeft: '-15px', height: 50, width: 100 }}
                    displayEmpty
                >
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
export default ProfileBirthday;