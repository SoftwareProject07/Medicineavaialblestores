const cartService = require("../services/cart.service");

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItems = await cartService.getCartByUser(userId);

    res.status(200).json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
