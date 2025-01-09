import React from 'react';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import './forgotpassword.css';
const ForgotPassword = () => {
    return (
        <Container component="main" maxWidth="xs">
            <div className="paperforgotpassword">
                <Avatar className="avatarforgotpassword">
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot your password?
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
                        Reset password
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                Login
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default ForgotPassword;
