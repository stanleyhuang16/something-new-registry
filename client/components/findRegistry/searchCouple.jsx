import React, { useState, useEffect } from "react";
import { link } from "react-router-dom";
import { Button, TextField, Dialog } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import useInput from "../hooks/useInput";
import useStyles from "../../style/theme";

const SearchCouple = (coupleUserName) => {
  const [searchCoupleRegistry, handleSearchVal, resetSearch] = useInput("");
  const classes = useStyles();

  const handleSubmitCouple = (e) => {
    e.preventDefault();

    if (!searchCoupleRegistry)
      return alert("Please fill in the search bar input!");
    // 1. Type couple ID from
    // 2. On send, the couple card with picture will apear on sucesssful query
    // 3. If couple can not be found, it will display a massage
    fetch(`/api/auth/searchcouple/${coupleUserName}`, {
      method: "GET",
      header: {
        "content-type": "Application/JSON",
      },
    })
      .then((resp) => {
        if (resp.status === 200) {
          console.log("here the resp", resp);
        }
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <>
      <form onSubmit={handleSubmitCouple}>
        <TextField
          className={classes.searchBar}
          variant="outlined"
          label="Search for a registry"
          value={searchCoupleRegistry}
          onChange={handleSearchVal}
          inputProps={{ className: classes.searchBar }}
        />
      </form>
      <Button
        className={classes.searchBtn}
        variant="contained"
        color="primary"
        onClick={handleSubmitCouple}
        endIcon={<SearchIcon />}
      >
        Search couple registry
      </Button>
    </>
  );
};

export default SearchCouple;
