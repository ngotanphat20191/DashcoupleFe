import React from 'react';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import './login.css'
const Login = () => {
    return (
        <Container component="main" maxWidth="xs">
            <div className="paperlogin">
                <Avatar className="avatarlogin">
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className="formlogin">
                    <TextField
                        fullWidth
                        margin="normal"
                        htmlFor="username"
                        type="text"
                        name="username"
                        id="username"
                        variant="outlined"
                        required
                        autoFocus
                        label="Username"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        htmlFor="password"
                        type="password"
                        name="password"
                        variant="outlined"
                        id="password"
                        required
                        label="Password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="submitlogin"
                    >
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/forgotpassword" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default Login;
