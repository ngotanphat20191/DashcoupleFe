import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import jwt_decode from 'jwt-decode';

const PUBLIC_ROUTES = [
  '/login', 
  '/signup', 
  '/forgotpassword', 
  '/login/admin',
  '/payment/success'
];

export default function UnauthorizedDialog() {
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('Bạn cần đăng nhập để truy cập trang này.');
  const navigate = useNavigate();
  const location = useLocation();
  
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };
  
  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    const token = localStorage.getItem('token');
    const hasToken = !!token;
    
    if (!isPublicRoute) {
      if (!hasToken) {
        setDialogMessage('Bạn cần đăng nhập để truy cập trang này.');
        setOpen(true);
      } else if (isTokenExpired(token)) {
        setDialogMessage('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [location.pathname]);
  
  const handleLogin = () => {
    navigate('/login');
    setOpen(false);
  };
  
  const handleSignup = () => {
    navigate('/signup');
    setOpen(false);
  };
  
  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box 
            sx={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              borderRadius: '50%', 
              p: 1.5, 
              mb: 2 
            }}
          >
            <LockIcon color="error" fontSize="large" />
          </Box>
          <Typography variant="h5" component="span" fontWeight="bold">
            Truy cập bị từ chối
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography align="center" sx={{ mb: 2 }}>
          {dialogMessage}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button 
          onClick={handleLogin} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Đăng nhập
        </Button>
        <Button 
          onClick={handleSignup} 
          variant="outlined" 
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Đăng ký
        </Button>
      </DialogActions>
    </Dialog>
  );
}