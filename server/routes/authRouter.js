const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authControllers.js');
const productController = require('../controllers/productControllers.js');

//Search couples route:
//
authRouter.get(
  '/searchcouple/:coupleQuery',
  authController.lookUpCouple,
  productController.getProducts,
  (req, res) => {
    console.log('sending result');

    //in this MVP version, we're just sending products directly, not sending username matches.
    //In the future, might remove the getProducts controller and instead just send the matches.
    // res.status(200).json({ usernameMatches: res.locals.usernameMatches });
    res.status(200).json({ products: res.locals.products });
  }
);

//SignUp Route:
//POST Request

authRouter.post(
  '/signup',
  authController.createUser,
  authController.setSSIDCookie,
  (req, res) => {
    res.status(200).json(res.locals.loginInfo);
  }
);

//Login Route:
//POST Request

authRouter.post(
  '/login',
  authController.verifyUser,
  authController.setSSIDCookie,
  (req, res) => {
    res.status(200).json(res.locals.loginInfo); //contains {email, userId}
  }
);

module.exports = authRouter;
