const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "active" })
      .populate("createdBy", "name email")
      .sort("-createdAt");

    res
      .status(200)
      .json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign not found" });
    }

    res.status(200).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const campaign = await Campaign.create(req.body);

    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign not found" });
    }

    // Make sure user is campaign owner
    if (
      campaign.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Not authorized to update this campaign",
        });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign not found" });
    }

    // Make sure user is campaign owner
    if (
      campaign.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Not authorized to delete this campaign",
        });
    }

    await campaign.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get my campaigns
// @route   GET /api/campaigns/my-campaigns
// @access  Private
exports.getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id }).sort(
      "-createdAt"
    );

    res
      .status(200)
      .json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
