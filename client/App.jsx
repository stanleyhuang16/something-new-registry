import React, { useState, useEffect } from "react";
import PrivateRoute from "./components/routes/PrivateRoute";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import About from "./components/about/About";
import Main from "./components/Main";
import SearchCouple from "./components/findRegistry/searchCouple.jsx";
import LoginBox from "./components/auth/LoginBox";
import {
  BrowserRouter,
  Switch,
  Route,
  withRouter,
  Link,
} from "react-router-dom";

//This line creates the websocket connection!!!

const App = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setId] = useState("");
  const [main, setMain] = useState("");
  const [coupleUsername, setCoupleUsername] = useState("");
  const logOut = () => {
    //need endpoint for backend
    setEmail("");
  };
  const [list, setList] = useState([]);

  const registerUser = (email, password, coupleUsername) => {
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, coupleUsername }),
    })
      .then((res) => res.json())
      .then(({ email, userId, coupleUsername }) => {
        console.log("register res:", email, userId);
        setCoupleUsername(coupleUsername);
        setEmail(email);
        setId(userId);
        setPassword(password);
      })
      .catch((err) => console.log("regUser ERROR: ", err));
  };

  const loginUser = (email, password) => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(({ email, userId }) => {
        if (!email || !userId)
          return alert("User not found. Please try again.");
        setEmail(email);
        setId(userId);
        setPassword(password);
      })
      .catch((err) => console.log("loginUser ERROR: ", err));
  };

  useEffect(() => {
    if (!email) return;
    setMain("/");
  }, [email]);

  useEffect(() => {
    if (!main) return;
    email && props.history.push(main);
    setMain("");
  }, [main]);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/register"
          exact
          render={(props) => (
            <Register registerUser={registerUser} {...props} />
          )}
        />
        <Route path="/about" exact component={About} />
        <Route
          path="/searchcouple"
          exact
          render={(props) => <SearchCouple list={list} setList={setList} />}
        />
        <Route path="/loginbox" exact component={LoginBox} />
        <Route
          path="/login"
          exact
          render={(props) => (
            <Login
              loginUser={loginUser}
              registerUser={registerUser}
              {...props}
            />
          )}
        />

        <PrivateRoute
          path="/"
          exact
          component={Main}
          email={email}
          password={password}
          userId={userId}
          loginUser={loginUser}
          registerUser={registerUser}
          logOut={logOut}
          list={list}
          setList={setList}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default withRouter(App);
