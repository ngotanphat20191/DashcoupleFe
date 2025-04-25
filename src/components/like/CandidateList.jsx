import { memo, useCallback } from 'react';
import { Box, Avatar, Typography, Chip, Paper, List, ListItem } from '@mui/material';
import { motion } from 'framer-motion';

const CandidateList = memo(({ profiles, currentIndex, onSelectCandidate }) => {
    const handleSelectCandidate = useCallback((index) => {
        if (onSelectCandidate) {
            onSelectCandidate(index);
        }
    }, [onSelectCandidate]);

    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: 'calc(100vh - 250px)',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#fc6ae7',
                    borderRadius: '10px',
                },
                border: '1px solid #fc6ae740',
                borderRadius: '16px',
                backgroundColor: '#fff'
            }}
        >
            <List sx={{ p: 1 }} disablePadding>
                {profiles.map((profile, index) => {
                    const user = profile.userRecord;
                    if (!user) return null;

                    const mainImage = profile.images && profile.images.length > 0
                        ? profile.images[0]
                        : 'https://via.placeholder.com/150';

                    const birthDate = user.date_of_birth ? new Date(user.date_of_birth) : null;
                    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/A';

                    return (
                        <ListItem
                            key={user.User_ID || index}
                            disablePadding
                            sx={{ mb: 1 }}
                        >
                            <motion.div
                                style={{ width: '100%' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Paper
                                    elevation={currentIndex === index ? 3 : 1}
                                    onClick={() => handleSelectCandidate(index)}
                                    sx={{
                                        p: 1.5,
                                        width: '100%',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        border: currentIndex === index ? '2px solid #fc6ae7' : '1px solid #fc6ae740',
                                        backgroundColor: currentIndex === index ? '#fff5fd' : '#fff',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            src={mainImage}
                                            alt={user.name || 'Profile'}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                border: '2px solid #fc6ae7',
                                                mr: 2
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {user.name || 'Chưa có tên'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                                                {age} tuổi • {user.city || 'N/A'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                <Chip
                                                    label={user.gender === 'Nu' ? 'Nữ' : user.gender}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: user.gender === 'Nu' ? '#ffb6c1' : '#add8e6',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.7rem',
                                                        height: 20,
                                                        mr: 1
                                                    }}
                                                />
                                                {user.Job && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: '120px',
                                                        }}
                                                    >
                                                        {user.Job}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
});

export default CandidateList;