import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import './forgotpassword.css';
import CircularProgress from '@mui/material/CircularProgress';

const ForgotPassword = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoaded(true);
        }, 200);
    }, []);
    if (loaded === false) {
        return (
            <div className="progress">
                <CircularProgress color="primary" />
            </div>
        );
    }
    return (
        <Container component="main">
            <div className="paperforgotpassword">
                <Avatar className="avatarforgotpassword">
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Quên mật khẩu
                </Typography>
                <form className="formforgotpassword">
                    <TextField
                        fullWidth
                        margin="normal"
                        htmlFor="email"
                        type="email"
                        name="email"
                        id="email"
                        variant="outlined"
                        required
                        autoFocus
                        label="your email address"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="submitforgotpassword"
                    >
                        Đổi mật khẩu
                    </Button>
                    <Grid container style={{marginTop: '15px'}}>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                Đăng nhập
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                Bạn đã có tài khoản, hãy đăng nhập!
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default ForgotPassword;
