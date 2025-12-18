const express = require("express");
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns,
} = require("../controllers/campaignController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getCampaigns).post(protect, createCampaign);

router.get("/my-campaigns", protect, getMyCampaigns);

router
  .route("/:id")
  .get(getCampaign)
  .put(protect, updateCampaign)
  .delete(protect, deleteCampaign);

module.exports = router;
