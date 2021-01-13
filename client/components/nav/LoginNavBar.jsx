import React from "react";
import { Link } from "react-router-dom";
import LoginBox from "../auth/LoginBox";

const LoginNavBar = ({ LoginUser, setLoginOpen, ...rest }) => {
  const handleClickOpen = () => {
    console.log("working!!");
    setLoginOpen(true);
  };
  const handleClose = () => setLoginOpen(false);
  const handleClickShowPasswordLogin = () =>
    setShowPasswordLogin(!showPassword);
  return (
    <nav>
      <button onClick={handleClickOpen}>Login</button>
      <Link to="/about">About</Link>
    </nav>
  );
};

export default LoginNavBar;
