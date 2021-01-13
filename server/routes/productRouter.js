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
  productController.scheduleReminderEmail,
  productController.redirectToStore,
  (req, res) => {
    res.status(200).json('guest is buying this product');
  }
);

//User indicates they have already purchased product
//POST request
productRouter.post(
  '/purchasedproduct/:coupleId',
  productController.purchasedProduct,
  (req, res) => {
    res.status(200).json('guest has already purchased this product');
  }
);

module.exports = productRouter;
