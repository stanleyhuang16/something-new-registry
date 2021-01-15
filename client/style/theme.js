import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    paddingTop: "15rem",
    background: "linear-gradient(to right, #FFFFFF, #B2FEFA)",
  },

  homepage: {
    background: "blue"
  },

  loginBox: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    textAlign: "center",
  },
  googleLetters: {
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  loginPaper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem 1.5rem",
    borderRadius: "2rem",
    [theme.breakpoints.down(913)]: {
      marginTop: "2rem",
    },
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
  },
  loginTextField: {
    marginBottom: "0.5rem",
    width: "25rem",
  },
  loginBtn: {
    width: "25rem",
    background: "#69b59a",
    color: "white",
    "&:hover": {
      background: "#54917c",
    },
  },
  loginDivider: {
    width: "20rem",
    margin: "1.5rem 0",
  },
  loginCreateAccountBtn: {
    background: "#69b59a",
    color: "white",
    "&:hover": {
      background: "#54917c",
    },
    height: '50px',
    width: '250px'
  },

  findRegistryBtn: {
    background: "white",
    color: "#69b59a",
    border: "2px solid #69b59a",
    "&:hover": {
      background: "#69b59a",
      color: "white",
    },
    height: '50px',
    width: '250px'
  },

  form: {
    padding: "1.5rem 3rem 3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  registerDivider: {
    width: "5rem",
    margin: "0.3rem 0 1.5rem",
  },
  registerBtn: {
    background: "#69b59a",
    color: "white",
    "&:hover": {
      background: "#54917c",
    },
    marginTop: "1rem",
    width: "50%",
    alignSelf: "center",
  },
  searchBar: {
    minWidth: "40vw",
    background: "white",
    borderRadius: "4rem",
    ["& fieldset"]: {
      borderRadius: "4rem",
    },
  },
  searchBtn: {
    borderRadius: "4rem",
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down(321)]: {
      marginTop: "0.5rem",
    },
    [theme.breakpoints.up(329)]: {
      marginLeft: "0.5rem",
    },
  },
  productAppBar: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    [theme.breakpoints.down(308)]: {
      justifyContent: "center",
    },
  },
  navBar: {
    display: "flex",
    alignItems: "center",
  },
  username: {
    fontSize: 17,
    marginLeft: "0.3rem",
    [theme.breakpoints.down(302)]: {
      fontSize: 13,
    },
  },
  productCard: {
    boxShadow: theme.shadows[3],
    minHeight: 700,
  },
  productCardMedia: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  productPrice: {
    [theme.breakpoints.down(184)]: {
      fontSize: 20,
    },
  },
  productDivider: {
    width: "100%",
    margin: "2rem 0",
  },
  scrollTop: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  searchList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2rem",
  },
  spinner: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0099F7, #F11712)",
  },
}));

export default useStyles;
