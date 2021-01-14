import React, { useState, useEffect } from "react";
import useInput from "../hooks/useInput";
import {
  Button,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  DialogTitle,
  Divider,
  Dialog,
  InputAdornment,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../../style/theme";
import inputCheck from "../../utils/inputCheck";

const LoginBox = ({ loginUser, setLoginOpen, ...rest }) => {
  const [emailInput, updateEmail, resetEmail] = useInput("");
  const [pwInput, updatePw, resetPw] = useInput("");
  const [showPassword, setShowPassword] = useState(false);

  const classes = useStyles();
  const handleCloseLogin = () => setLoginOpen(false);
  const handleClickShowPasswordLogin = () =>
    setShowPasswordLogin(!showPassword);

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
    <div className={classes.form}>
      <IconButton
        aria-label="close"
        onClick={handleCloseLogin}
        style={{ alignSelf: "flex-end" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ padding: "0" }}>Log into your registry</DialogTitle>
      <Divider className={classes.registerDivider} variant="middle" />
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
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordLogin}
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
    </div>
  );
};

export default LoginBox;
