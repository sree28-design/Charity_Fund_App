const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const User = require("../models/User");

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, message, isAnonymous } = req.body;

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign not found" });
    }

    // Check if user has enough balance
    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res
        .status(400)
        .json({ success: false, error: "Insufficient balance" });
    }

    // Create donation
    const donation = await Donation.create({
      amount,
      campaign: campaignId,
      donor: req.user.id,
      message,
      isAnonymous: isAnonymous || false,
    });

    // Update campaign amount
    campaign.currentAmount += amount;
    if (campaign.currentAmount >= campaign.goalAmount) {
      campaign.status = "completed";
    }
    await campaign.save();

    // Deduct from user balance
    user.balance -= amount;
    await user.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate("campaign", "title")
      .populate("donor", "name email");

    res.status(201).json({
      success: true,
      data: populatedDonation,
      newBalance: user.balance,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get my donations
// @route   GET /api/donations/my-donations
// @access  Private
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate("campaign", "title category")
      .sort("-createdAt");

    res
      .status(200)
      .json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get donations for a campaign
// @route   GET /api/donations/campaign/:campaignId
// @access  Public
exports.getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      campaign: req.params.campaignId,
      isAnonymous: false,
    })
      .populate("donor", "name")
      .sort("-createdAt")
      .limit(10);

    res
      .status(200)
      .json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get donation stats
// @route   GET /api/donations/stats
// @access  Private
exports.getDonationStats = async (req, res) => {
  try {
    const totalDonated = await Donation.aggregate([
      { $match: { donor: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const campaignsSupported = await Donation.distinct("campaign", {
      donor: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: {
        totalDonated: totalDonated[0]?.total || 0,
        campaignsSupported: campaignsSupported.length,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
