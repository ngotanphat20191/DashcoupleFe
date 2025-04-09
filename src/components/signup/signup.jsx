import {useState} from 'react';
import {Container, Avatar, Typography, TextField, Button, Grid, Link, IconButton} from '@mui/material';
import {InputAdornment} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from "@mui/icons-material/Email";
import './signup.css';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {loginSignUpAxios} from '../../config/axiosConfig.jsx'
import {Formik} from "formik";
import * as Yup from "yup";

export default function Signup(){
    const [showPassword, setShowPassword] = useState(false)
    const [disabledSend, setDisabledSend] = useState(false)
    const [awaitResponse, setAwaitResponse] = useState(false)

    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email("Nhập email")
            .required("Cần nhập email"),

        password: Yup.string()
            .min(8, "Mật khẩu quá ngắn")
            .max(30, "Mật khẩu quá dài")
            .required("Cần nhập mật khẩu"),

        confirm: Yup.string()
            .oneOf([Yup.ref('password'), null], "Mật khẩu không trùng")
            .required("Chưa nhập đủ dữ liệu")
    });

    function sendSignUpRequest(data){
        loginSignUpAxios.post('/signup', {
            username: data.email,
            password: data.password,
            role: "COUPLE",
            type: "CLASSIC"
        }).then(res => {
            setAwaitResponse(false)
            alert(res.data)
        }).catch(err => {
            setAwaitResponse(false)
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }

    return (
        <Container component="main">
            <div className="papersignup">
                <Avatar className="avatasignup">
                    <LockIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Đăng ký
                </Typography>
                <Formik
                    initialValues={{ email: '', password: '', confirm: ''}}
                    validationSchema={signUpSchema}
                    onSubmit={async (values) => {
                        setAwaitResponse(true)
                        await (sendSignUpRequest(values))
                        setDisabledSend(true)
                        setTimeout(() => setDisabledSend(false), 5000)
                    }}
                >
                    {({
                          values, errors, touched,
                          handleChange, handleBlur,
                          handleSubmit
                      }) => (
                            <form className="formsignup"    onSubmit={handleSubmit}>
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
                                            label="Email Address"
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
                                            label="Password"
                                            id="password"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder={"Xác nhận mật khẩu"}
                                            type={showPassword ? 'text' : 'password'}
                                            name={'confirm'}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.confirm}
                                            error={touched.confirm && Boolean(errors.confirm)}
                                            helperText={touched.confirm && errors.confirm}
                                            InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                                endAdornment: (<InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>),}}
                                            variant="outlined"
                                            htmlFor="password"
                                            id="passwordConfirm"
                                            label="Re-enter password"
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
                                    {awaitResponse ? <div className={'loader'}></div> : <div>Đăng ký</div>}
                                </Button>
                                <Grid container justify="flex-end" style={{marginTop: '15px'}}>
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            Bạn đã có tài khoản, hãy đăng nhập!
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};
