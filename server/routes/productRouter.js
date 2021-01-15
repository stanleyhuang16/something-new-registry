const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/productControllers');

//Product Routers:

//Get All Products:
//GET Request
productRouter.get('/:coupleId', productController.getProducts, (req, res) => {
  res.status(200).json({ products: res.locals.products });
});

//Couple Add One Product to their registry:
//POST Request
productRouter.post(
  '/addproduct/:coupleId',
  productController.addProduct,
  (req, res) => {
    res.status(200).json('Added product to registry');
  }
);

//Delete One Product from registry:
//DELETE Request
productRouter.delete(
  '/deleteproduct/:coupleId/:productId',
  productController.deleteProduct,
  (req, res) => {
    res.status(200).json('Deleted product from registry');
  }
);

//User clicks "buy from store" -> grey out product
// POST request
productRouter.post(
  '/buyproduct/:coupleId',
  productController.setOnHoldTrue,
  productController.scheduleOnHoldFalse,
  // productController.scheduleReminderEmail,
  productController.redirectToStore,
  (req, res) => {
    res.status(200).json({ storeUrl: res.locals.storeUrl });
  }
);

//User indicates they have already purchased product
//POST request

/*Description: 
  //pre-work: 
    X insert "purchased" into the couple_to_products table 
  //In the req.body we have: {coupleId, guestFirst, guestLast, guestEmail, productId }

    1. set purchased to true in database
        Inside this controller, emit a websocket event to alert front end. 
    2. email the couple that this person bought this product. 
  

*/

productRouter.post(
  '/purchasedproduct/:coupleId',
  productController.setPurchasedToTrue,
  productController.notifyCoupleOfPurchase,
  (req, res) => {
    res.status(200).json('guest has already purchased this product');
  }
);

module.exports = productRouter;
