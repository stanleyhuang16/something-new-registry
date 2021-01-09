import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import Register from './Register';
import LoginNavBar from '../nav/LoginNavBar';
import {
  Button,
  Box,
  Divider,
  AppBar,
  Paper,
  TextField,
  Typography,
  Grow,
  Slide,
  IconButton,
  InputAdornment,
  Dialog,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from '../../style/theme';
import inputCheck from '../../utils/inputCheck';

const Login = ({ registerUser, loginUser, ...rest }) => {
  const [emailInput, updateEmail, resetEmail] = useInput('');
  const [pwInput, updatePw, resetPw] = useInput('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // const buildHandler =()=>

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = inputCheck(emailInput, pwInput);
    if (err) return alert(err);

    loginUser(emailInput, pwInput);

    resetEmail();
    resetPw();
  };

  return (
    <div
      className={classes.root}
      style={{ filter: open ? 'blur(5px)' : 'none' }}
    >
      <AppBar>
        <LoginNavBar />
      </AppBar>
      <Box className={classes.loginBox} flexWrap="wrap">
        <Button
          className={classes.loginCreateAccountBtn}
          onClick={handleClickOpen}
          variant="contained"
        >
          Build your own
        </Button>
        <Link to="/searchcouple">Find Registry</Link>
        <Slide direction="up" in>
          <Paper className={classes.loginPaper} elevation={10}>
            <form className={classes.loginForm} onSubmit={handleSubmit}>
              <TextField
                className={classes.loginTextField}
                id="email"
                label="Email"
                variant="outlined"
                value={emailInput}
                onChange={updateEmail}
              />
              <TextField
                className={classes.loginTextField}
                id="password"
                label="Password"
                variant="outlined"
                value={pwInput}
                onChange={updatePw}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className={classes.loginBtn}
                type="submit"
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Log In
              </Button>
            </form>
            <Divider className={classes.loginDivider} variant="middle" />

            <Dialog open={open} onClose={handleClose}>
              <Register registerUser={registerUser} setOpen={setOpen} />
            </Dialog>
          </Paper>
        </Slide>
      </Box>
    </div>
  );
};

export default Login;
