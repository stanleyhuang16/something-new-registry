import React from "react";
import { Link } from "react-router-dom";
import LoginBox from "../auth/LoginBox";
import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";


const LoginNavBar = ({ LoginUser, setLoginOpen, ...rest }) => {
  const handleClickOpen = () => {
    console.log("working!!");
    setLoginOpen(true);
  };
  const handleClose = () => setLoginOpen(false);
  const handleClickShowPasswordLogin = () =>
    setShowPasswordLogin(!showPassword);
  return (
    <nav styles ={{position: 'relative'}}>
      <Typography style ={{ fontSize: '30px', color:'black', position: 'absolute', top: '25%', left:'10%'}}>Something New Registery</Typography>
      <Button onClick={handleClickOpen} style ={{position: 'absolute', top: '25%', right:'10%'}}>Login</Button>
      {/* <Link to="/about">About</Link> */}
    </nav>
  );
};

export default LoginNavBar;
