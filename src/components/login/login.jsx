import React, {useState, useCallback, useMemo, memo} from 'react';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import './login.css'
import * as Yup from "yup";
import {Formik} from "formik";
import {loginSignUpAxios, createCancelToken} from '../../config/axiosConfig.jsx'
import {IconButton, InputAdornment, Alert, Snackbar} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import {Visibility, VisibilityOff} from "@mui/icons-material";

// Memoize static components
const MemoizedAvatar = memo(({ children, className }) => (
  <Avatar className={className}>
    {children}
  </Avatar>
));


function Login(){
    // State management
    const [showPassword, setShowPassword] = useState(false);
    const [disabledSend, setDisabledSend] = useState(false);
    const [awaitResponse, setAwaitResponse] = useState(false);
    const [error, setError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    // Memoize validation schema to prevent unnecessary recreations
    const signUpSchema = useMemo(() => Yup.object().shape({
        email: Yup.string()
            .email("Nhập email")
            .required("Cần nhập email"),

        password: Yup.string()
            .min(8, "Mật khẩu quá ngắn")
            .max(30, "Mật khẩu quá dài")
            .required("Cần nhập mật khẩu"),
    }), []);
    
    // Toggle password visibility with useCallback
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);
    
    // Handle snackbar close
    const handleSnackbarClose = useCallback(() => {
        setShowSnackbar(false);
    }, []);
    
    // Optimize login request with proper error handling
    const sendLoginRequest = useCallback(async (data) => {
        setAwaitResponse(true);
        const cancelTokenSource = createCancelToken();
        
        try {
            const response = await loginSignUpAxios.post('/login', {
                username: data.email,
                password: data.password,
            }, {
                cancelToken: cancelTokenSource.token
            });
            
            // Store token in localStorage
            localStorage.setItem('token', response.data);
            
            // Show success message
            setSnackbarMessage('Đăng nhập thành công! Đang chuyển hướng...');
            setSnackbarSeverity('success');
            setShowSnackbar(true);
            
            // Reset loading state
            setAwaitResponse(false);
            
            // Redirect after delay
            setTimeout(() => window.location.href = '/', 2000);
        } catch (err) {
            // Reset loading state
            setAwaitResponse(false);
            
            // Handle errors
            if (err.response?.status === 400) {
                setError(err.response.data);
                setSnackbarMessage(err.response.data);
                setSnackbarSeverity('error');
                setShowSnackbar(true);
            } else {
                console.error("Login error:", err);
                setSnackbarMessage('Đã xảy ra lỗi khi đăng nhập');
                setSnackbarSeverity('error');
                setShowSnackbar(true);
            }
        }
    }, []);
    // Memoize the form submission handler
    const handleFormSubmit = useCallback(async (values) => {
        setAwaitResponse(true);
        await sendLoginRequest(values);
        setDisabledSend(true);
        setTimeout(() => setDisabledSend(false), 5000);
    }, [sendLoginRequest]);
    
    // Memoize the form component for better performance
    const loginForm = useMemo(() => (
        <Formik
            initialValues={{ email: '', password: ''}}
            validationSchema={signUpSchema}
            onSubmit={handleFormSubmit}
        >
            {({
                values, errors, touched,
                handleChange, handleBlur,
                handleSubmit
            }) => (
                <form className="formsignup" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                placeholder={"Nhập email"}
                                name={'email'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                htmlFor="email"
                                type="email"
                                id="email"
                                label="Email"
                                required
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                placeholder={"Nhập mật khẩu"}
                                type={showPassword ? 'text' : 'password'}
                                name={'password'}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={togglePasswordVisibility}
                                                aria-label="toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                htmlFor="password"
                                label="Mật khẩu"
                                id="password"
                                required
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant={'contained'} 
                        type={'submit'} 
                        disabled={disabledSend || awaitResponse} 
                        color="primary" 
                        fullWidth
                        sx={{
                            marginBlock: '1rem',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1b3c3f'
                            }
                        }}
                    >
                        {awaitResponse ? <div className={'loader'}></div> : <div>Đăng nhập</div>}
                    </Button>
                    <Grid container style={{marginTop: '15px'}}>
                        <Grid item xs>
                            <Link href="/forgotpassword" variant="body2">
                                Quên mật khẩu
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                Bạn chưa có tài khoản, hãy đăng ký!
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    ), [signUpSchema, handleFormSubmit, showPassword, togglePasswordVisibility, disabledSend, awaitResponse]);
    
    return (
        <Container component="main">
            <div className="paperlogin">
                <MemoizedAvatar className="avatarlogin">
                    <LockIcon/>
                </MemoizedAvatar>
                <Typography component="h1" variant="h5">
                    Đăng nhập
                </Typography>
                
                {/* Show error message if any */}
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {/* Render the memoized form */}
                {loginForm}
                
                {/* Snackbar for notifications */}
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert 
                        onClose={handleSnackbarClose} 
                        severity={snackbarSeverity} 
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </Container>
    );
}

// Export memoized component for better performance
export default memo(Login);
