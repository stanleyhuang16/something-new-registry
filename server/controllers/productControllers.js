const priceTrackerDB = require('../models/priceTrackerModel.js');
const getProductInfo = require('../utils/productWebscraping.js');
const CronJob = require('cron').CronJob;
const sendReminderEmail = require('../emails/sendReminderEmail');

const productController = {};

//Get Products Controller- GET Request:
productController.getProducts = (req, res, next) => {
  // This gets the user's products with the most recent timestamp:
  const userProducts = `SELECT DISTINCT ON (lowest_daily_price.product_id) *
  FROM couple_to_products
    JOIN products ON couple_to_products.product_id=products._id
    JOIN lowest_daily_price ON lowest_daily_price.product_id=products._id
  WHERE couple_to_products.couple_id=$1
  ORDER BY lowest_daily_price.product_id, lowest_daily_price.timestamp DESC;
  `;

  let values = [req.params.coupleId];

  priceTrackerDB
    .query(userProducts, values)
    .then((data) => {
      res.locals.products = data.rows;
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(
        res.status(400).send('ERROR in getProducts controller: ' + err)
      );
    });
};

//Add Product Controller- POST Request:
productController.addProduct = async (req, res, next) => {
  // front end sends couple_id and google_url only.  Then we use puppeteer to scrape the following:
  const { google_url } = req.body; //from websraping and frontend
  const { coupleId } = req.params;
  let productInfo = {};

  console.log('google_url', google_url);

  //Web scrape the google_url:
  try {
    productInfo = await getProductInfo(google_url); //Returns an object: {lowest_daily_price, product_name, store_url, store_name, image_url}
  } catch (err) {
    return next(
      res.status(400).send('ERROR in getProductsInfo function: ' + err)
    );
  }

  //Add google_url to object:
  productInfo.google_url = google_url;

  //Query to check if the product is already in the products table.
  let productInTableQuery = `SELECT * FROM products WHERE products.google_url=$1`;
  const productInTable = await priceTrackerDB.query(productInTableQuery, [
    google_url,
  ]);
  let productId = '';

  if (productInTable.rows.length > 0) {
    //If already exist: add product_id to object
    productId = productInTable.rows[0]._id;
  } else {
    //If does not already exsit:
    //Add to products table and return product_id. Then add product_id to object
    const newProductId = await priceTrackerDB.query(
      `INSERT INTO products (product_name, image_url, google_url) VALUES ($1,$2,$3) returning products._id`,
      [productInfo.product_name, productInfo.image_url, productInfo.google_url]
    );
    productId = newProductId.rows[0]._id;
  }

  //Add to couple_to_products table using product_id:
  const usersToProductsQuery = `INSERT into couple_to_products (couple_id,product_id,on_hold) VALUES ($1,$2,$3)`;
  const usersToProductsValues = [coupleId, productId, false];

  //Add to lowest_daily_price table using product_id:
  const lowestDailyPriceQuery = `INSERT into lowest_daily_price (product_id, store_name, lowest_daily_price, store_url) VALUES ($1,$2,$3,$4)`;

  const lowestDailyPriceValues = [
    productId,
    productInfo.store_name,
    productInfo.lowest_daily_price,
    productInfo.store_url,
  ];
  try {
    const userToProductsInsert = await priceTrackerDB.query(
      usersToProductsQuery,
      usersToProductsValues
    );
    const lowestDailyPriceInsert = await priceTrackerDB.query(
      lowestDailyPriceQuery,
      lowestDailyPriceValues
    );

    return next();
  } catch (err) {
    console.log('error: ', err);
    return next('ERROR in addProducts controller: ');
  }
};

//Delete Product Controller- DELETE Request:
productController.deleteProduct = (req, res, next) => {
  const { coupleId, productId } = req.params;

  const deleteProductFromUser = `DELETE FROM couple_to_products WHERE couple_id=$1 AND product_id=$2`;

  let values = [coupleId, productId];

  priceTrackerDB
    .query(deleteProductFromUser, values)
    .then((data) => {
      return next();
    })
    .catch((err) => {
      console.log('error in deleteProducts: ', err);
      return next('ERROR in deleteProducts controller: ');
    });
};

//Greying out:

/*
endpoint: POST /api/products/buyproduct/:coupleId
reqBody: {coupleId, productId, guestFirst, guestLast, guestEmail, productUrl}
resBody:
 on success: Redirect to the store page in new window
 on fail: 400 {error: String, productName}
*/

//Goal: for the couple_to_products table:
//change on_hold to true when buy product is clicked.
//15 mins later, change on_hold to false

//Option 1:
//Immediately change the database to true, then use a cron-job to run in 15 min to change it to false.

//Option 2:
//move on_hold to a row in mongoDB, then expire that row in 15 mins.

//Job to run: 15 min from the point the link is clicked, change this product to on_hold = false.

//Schedule: Date.now() + 15 min.

// 1. set database to on_hold = true
productController.setOnHoldTrue = async (req, res, next) => {
  const { productId, coupleId } = req.body;
  try {
    const result = await setOnHold(productId, coupleId, true);
    req.io.emit('setHold');
    if (result.length === 0)
      return next('Error: in setOnHoldTrue updating couple_to_products table');
    next();
  } catch (err) {
    next('Error in setOnHoldTrue: ', err);
  }
};

// helper function for setOnHoldTrue
const setOnHold = (productId, coupleId, boolean) => {
  const queryString = `UPDATE couple_to_products 
SET on_hold = $3
WHERE product_id = $1 AND couple_id = $2
RETURNING *`;

  values = [productId, coupleId, boolean];

  return new Promise((resolve, reject) => {
    priceTrackerDB
      .query(queryString, values)
      .then((data) => {
        console.log('data.rows', data.rows);

        //Here, emit via websocket that on_hold changed.

        resolve(data.rows);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

// const setOnHoldFalse = (productId, coupleId, boolean) => {
//   const queryString = `UPDATE couple_to_products
// SET on_hold = $3
// WHERE product_id = $1 AND couple_id = $2
// RETURNING *`;

//   values = [productId, coupleId, boolean];

//   return new Promise((resolve, reject) => {
//     priceTrackerDB
//       .query(queryString, values)
//       .then((data) => {
//         console.log('data.rows', data.rows);
//         resolve(data.rows);
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err);
//       });
//   });
// };

// 2. schedule a job that set on_hold = false in 15 mins.
productController.scheduleOnHoldFalse = (req, res, next) => {
  const { productId, coupleId } = req.body;

  const timeDiff = 1;
  const currentDateObj = new Date();
  const newDateObj = new Date(
    currentDateObj.getTime() + (timeDiff * 60000) / 6
  );

  const job = new CronJob(newDateObj, () => {
    setOnHold(productId, coupleId, false);
    req.io.emit('setHold');
  });
  job.start();
  next();
};

//3. schedule a job to send an email - in 12 hours, email reminds guest to click "bought product" if they bought it.
productController.scheduleReminderEmail = (req, res, next) => {
  const { productId, coupleId } = req.body;

  const queryString = `SELECT couples.email, couples.couple_username, products.product_name, products.google_url
  FROM couple_to_products
    JOIN products ON couple_to_products.product_id=products._id
    JOIN couples ON couple_to_products.couple_id=couples._id
  WHERE couple_to_products.couple_id=$1 AND products._id=$2
  `;
  values = [coupleId, productId];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      console.log('data.rows', data.rows);
      if (!data.rows.length) return next('Error in scheduleReminderEmail');
      const coupleUsername = data.rows[0].couple_username;
      const email = data.rows[0].email;
      const productName = data.rows[0].product_name;
      const siteUrl = data.rows[0].google_url;

      // send email after timeDiff minutes
      const timeDiff = 1;
      const currentDateObj = new Date();
      const newDateObj = new Date(
        currentDateObj.getTime() + (timeDiff * 60000) / 6
      );

      const job = new CronJob(newDateObj, () =>
        sendReminderEmail(coupleUsername, email, productName, siteUrl)
      );
      job.start();

      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });

  next();
};

//4. redirect the guest to the store page
productController.redirectToStore = (req, res, next) => {
  next();
};

productController.purchasedProduct = (req, res, next) => {
  next();
};

module.exports = productController;
