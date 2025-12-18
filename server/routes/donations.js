const express = require("express");
const {
  createDonation,
  getMyDonations,
  getCampaignDonations,
  getDonationStats,
} = require("../controllers/donationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createDonation);
router.get("/my-donations", protect, getMyDonations);
router.get("/stats", protect, getDonationStats);
router.get("/campaign/:campaignId", getCampaignDonations);

module.exports = router;
