import {useLocation, useNavigate} from 'react-router-dom';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {useAuth} from '../../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const PUBLIC_ROUTES = [
    '/login',
    '/signup',
    '/forgotpassword',
    '/login/admin',
    '/payment/success'
];

export const AuthGuard = ({children}) => {
    const {isAuthenticated, sessionExpired} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    if (!isAuthenticated && !isPublicRoute) {
        return <UnauthorizedDialog/>;
    }

    return (
        <>
            {children}
            {sessionExpired && <SessionExpiredDialog/>}
        </>
    );
};

export const UnauthorizedDialog = () => {
    const navigate = useNavigate();

    return (
        <Dialog
            open={true}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
                }
            }}
        >
            <DialogTitle sx={{textAlign: 'center', pt: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                    <LockIcon sx={{fontSize: 48, color: '#e91e63'}}/>
                </Box>
                <Typography variant="h5" component="div" fontWeight="bold" color="#333">
                    Truy cập bị từ chối
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography align="center" color="#555" sx={{mb: 2}}>
                    Bạn cần đăng nhập để truy cập trang này.
                </Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center', pb: 3}}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                        borderRadius: 4,
                        px: 4,
                        py: 1,
                        background: 'linear-gradient(45deg, #e91e63 30%, #ff5c8d 90%)',
                        boxShadow: '0 4px 10px rgba(233, 30, 99, 0.25)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #d81557 30%, #ff4081 90%)',
                            boxShadow: '0 6px 12px rgba(233, 30, 99, 0.3)',
                        }
                    }}
                >
                    Đăng nhập
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const SessionExpiredDialog = () => {
    const {resetSessionExpired} = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        resetSessionExpired();
        navigate('/login');
    };

    return (
        <Dialog
            open={true}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
                }
            }}
        >
            <DialogTitle sx={{textAlign: 'center', pt: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                    <AccessTimeIcon sx={{fontSize: 48, color: '#ff9800'}}/>
                </Box>
                <Typography variant="h5" component="div" fontWeight="bold" color="#333">
                    Đã hết phiên làm việc
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography align="center" color="#555" sx={{mb: 2}}>
                    Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
                </Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center', pb: 3}}>
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                        borderRadius: 4,
                        px: 4,
                        py: 1,
                        background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                        boxShadow: '0 4px 10px rgba(255, 152, 0, 0.25)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #f57c00 30%, #ffa726 90%)',
                            boxShadow: '0 6px 12px rgba(255, 152, 0, 0.3)',
                        }
                    }}
                >
                    Đăng nhập lại
                </Button>
            </DialogActions>
        </Dialog>
    );
};