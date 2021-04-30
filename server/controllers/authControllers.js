const priceTrackerDB = require("../models/priceTrackerModel.js");
const bcrypt = require("bcryptjs");

const authController = {};

//Signup Controller- POST Request:
authController.createUser = async (req, res, next) => {
  if (req.body.email.length && req.body.password.length) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let queryString = `
    INSERT INTO couples ( email, couple_username, password ) VALUES ($1, $2, $3) RETURNING *
    `;

    let values = [req.body.email, req.body.coupleUsername, hashedPassword];

    priceTrackerDB
      .query(queryString, values)
      .then((data) => {
        res.locals.loginInfo = {};
        res.locals.loginInfo.coupleId = data.rows[0]._id;
        res.locals.loginInfo.coupleUsername = data.rows[0].coupleusername;
        res.locals.loginInfo.email = req.body.email;
        return next();
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  } else {
    console.log("password or username rejected");
    return res.status(418).json({ error: "invalid email or password" });
  }
};

//SSIDCookie Controller:
authController.setSSIDCookie = (req, res, next) => {
  //First, set cookie on the client to a random number:
  let randomNumber = Math.floor(Math.random() * 1000000);
  let options = { maxAge: 90000000 };

  res.cookie("ssid", randomNumber, options);

  //second, save the ssid into the database.
  let queryString = `
  INSERT INTO sessions (couple_id, ssid) VALUES ($1, $2) RETURNING *
  `;
  let values = [res.locals.loginInfo.userId, randomNumber];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });

  return next();
};

//Login Controller - POST Request:
authController.verifyUser = (req, res, next) => {
  let queryString = `
    SELECT * FROM couples WHERE email=$1
    `;
  let values = [req.body.email];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      if (data.rows.length) {
        bcrypt
          .compare(req.body.password, data.rows[0].password)
          .then((isMatch) => {
            if (isMatch) {
              res.locals.loginInfo = {};
              res.locals.loginInfo.userId = data.rows[0]._id;
              res.locals.loginInfo.coupleId = data.rows[0]._id;
              res.locals.loginInfo.email = req.body.email;
              return next();
            } else {
              return res.status(400).json({ error: "invalid password" });
            }
          });
      } else {
        console.log("invalid email or password");
        return res.status(200).json({ error: "invalid email or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

//Checks if the username is in the database.
authController.checkUsername = (req, res, next) => {
  console.log("in check username");
  const { coupleusername } = req.params;
  let queryString = `
    SELECT *
    FROM couples
    WHERE couple_username = $1
  `;

  let values = [coupleusername];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      if (data.rows.length) {
        res.locals.coupleInfo = {};
        res.locals.coupleInfo.coupleUsername = data.rows[0].couple_username;
        res.locals.coupleInfo.coupleId = data.rows[0]._id;
        res.locals.coupleInfo.coupleEmail = data.rows[0].email;
        return next();
      } else {
        return res.status(400).json({ error: "no couple found" });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

authController.lookUpCouple = (req, res, next) => {
  const { coupleQuery } = req.params;

  let queryString = `
    SELECT couple_username, _id
    FROM couples
    WHERE couple_username LIKE '%' || $1 || '%'
  `;
  let values = [coupleQuery];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      console.log("data.rows: ", data.rows);
      if (data.rows.length) {
        //do next: need to iterate through the results and grab usernames
        // res.locals.usernameMatches = [];
        // for (let resultRow of data.rows) {
        //   res.locals.usernameMatches.push(resultRow.couple_username);
        // }

        //since we're only getting the exact match here, assume that the first result is correct.
        req.params.coupleId = data.rows[0]._id;
        console.log("coupleId in lookUpCouple", req.params.coupleId);

        return next();
      } else {
        return res.status(400).json({ error: "no couples match your search" });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

module.exports = authController;
