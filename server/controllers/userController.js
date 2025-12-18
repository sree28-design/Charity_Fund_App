const User = require("../models/User");

// @desc    Get user balance
// @route   GET /api/users/balance
// @access  Private
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: { balance: user.balance } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update user balance (for demo purposes - add funds)
// @route   PUT /api/users/balance
// @access  Private
exports.updateBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a valid amount" });
    }

    const user = await User.findById(req.user.id);
    user.balance += amount;
    await user.save();

    res.status(200).json({ success: true, data: { balance: user.balance } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
