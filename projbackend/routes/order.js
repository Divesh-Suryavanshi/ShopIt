const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

// CONTROLLERES
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
} = require("../controllers/order");

// PARAMS
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// Actual routes
// Create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

// Read
router.get(
  "/order/all/:userId/",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

// Status of Order
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
