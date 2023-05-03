const router = require("express").Router();
const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let products = await Order.find({ owner: req.decoded._id })
      .populate("owner products.productID").lean();
    res.json({
      success: true,
      products: products
    });
  } catch (err) {
    console.log("Error While Get Orders List >>>", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
