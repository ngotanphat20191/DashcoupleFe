import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './login.css'
import * as Yup from "yup";
import {Formik} from "formik";
import {loginAdminSignUpAxios} from '../../../config/axiosConfig.jsx'
import {IconButton, InputAdornment} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import {Visibility, VisibilityOff} from "@mui/icons-material";


export default function AdminLogin(){
    const [showPassword, setShowPassword] = useState(false)
    const [disabledSend, setDisabledSend] = useState(false)
    const [awaitResponse, setAwaitResponse] = useState(false)
    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email("nhap email")
            .required("Can nhap email"),

        password: Yup.string()
            .min(1, "mat khau qua ngan")
            .max(30, "mat khau qua dai")
            .required("can nhap mat khau"),
    });
    function sendLoginRequest(data) {
        loginAdminSignUpAxios.post('/login', {
            username: data.email,
            password: data.password,
        }).then(async res => {
            localStorage.setItem('token', res.data)
            setAwaitResponse(false)
            setTimeout(() => window.location.href = '/admin', 2000)
        }).catch(err => {
            setAwaitResponse(false)
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }
    return (
        <Container component="main">
            <div className="paperlogin">
                <Avatar className="avatarlogin">
                    <LockIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Đăng nhập
                </Typography>
                <Formik
                    initialValues={{ email: '', password: ''}}
                    validationSchema={signUpSchema}
                    onSubmit={async (values) => {
                        setAwaitResponse(true)
                        await (sendLoginRequest(values))
                        setDisabledSend(true)
                        setTimeout(() => setDisabledSend(false), 5000)
                    }}
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
                                        InputProps={{startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>),}}
                                        variant="outlined"
                                        htmlFor="email"
                                        type="email"
                                        id="email"
                                        label="Email"
                                        required
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
                                        InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                            endAdornment: (<InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>),}}
                                        variant="outlined"
                                        htmlFor="password"
                                        label="Mật khẩu"
                                        id="password"
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant={'contained'} type={'submit'} disabled={disabledSend} color="primary" fullWidth
                                sx={{marginBlock: '1rem',
                                    color: 'white',
                                    '&:hover': {backgroundColor: '#1b3c3f'
                                    }}}
                            >
                                {awaitResponse ? <div className={'loader'}></div> : <div>Đăng nhập</div>}
                            </Button>
                </form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};
