const priceTrackerDB = require('../models/priceTrackerModel.js');
const getProductInfo = require('../utils/productWebscraping.js');

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
  const lowestDailyPriceQuery = `INSERT into lowest_daily_price (product_id, store_name, lowest_daily_price,	store_url) VALUES ($1,$2,$3,$4)`;

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
    return next(
      res.status(400).send('ERROR in addProducts controller: ' + err)
    );
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
      return next(
        res.status(400).send('ERROR in deleteProducts controller: ' + err)
      );
    });
};

productController.buyProduct = (req, res, next) => {
  next();
};

productController.purchasedProduct = (req, res, next) => {
  next();
};

module.exports = productController;
