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

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login', 
  '/signup', 
  '/forgotpassword', 
  '/login/admin',
  '/payment/success'
];

export default function UnauthorizedDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if the current route is protected and user doesn't have a token
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    const hasToken = !!localStorage.getItem('token');
    
    if (!isPublicRoute && !hasToken) {
      setOpen(true);
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
          Bạn cần đăng nhập để truy cập trang này.
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