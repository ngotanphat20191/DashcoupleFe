import React from 'react';
import {Container, Avatar, Typography, TextField, Button, Grid, Link} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import './signup.css';
import {inputs} from '../../datas/template.jsx';
const Signup = () => {
    return (
        <Container component="main" maxWidth="xs">
            <div className="papersignup">
                <Avatar className="avatasignup">
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className="formsignup">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="firstname"
                                type="text"
                                name="firstname"
                                value={inputs.firstname}
                                id="firstname"
                                variant="outlined"
                                label="First Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="surname"
                                type="text"
                                name="surname"
                                value={inputs.surname}
                                id="surname"
                                label="Last Name"
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="username"
                                type="text"
                                name="username"
                                value={inputs.username}
                                id="username"
                                variant="outlined"
                                required
                                label="Username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="email"
                                type="email"
                                name="email"
                                value={inputs.email}
                                id="email"
                                variant="outlined"
                                label="Email Address"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="password1"
                                type="password"
                                name="password1"
                                label="Password"
                                value={inputs.password1}
                                id="password1"
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                htmlFor="password2"
                                type="password"
                                name="password2"
                                value={inputs.password2}
                                id="password2"
                                variant="outlined"
                                label="Re-enter password"
                                required
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="submitsignup"
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Signup;

