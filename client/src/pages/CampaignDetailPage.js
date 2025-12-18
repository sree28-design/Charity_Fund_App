import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Box,
  Chip,
  TextField,
  Alert,
  Divider,
} from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user, updateUser } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCampaignDetails();
    fetchDonations();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await API.get(`/campaigns/${id}`);
      setCampaign(response.data.data);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await API.get(`/donations/campaign/${id}`);
      setDonations(response.data.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleDonate = async () => {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please login to donate");
      return;
    }

    if (!donationAmount || donationAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const response = await API.post("/donations", {
        campaignId: id,
        amount: parseFloat(donationAmount),
        message,
      });

      setSuccess(`Successfully donated $${donationAmount}!`);
      setDonationAmount("");
      setMessage("");

      // Update user balance
      updateUser({ ...user, balance: response.data.newBalance });

      // Refresh campaign and donations
      fetchCampaignDetails();
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.error || "Donation failed");
    }
  };

  if (!campaign) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              sx={{
                height: 400,
                bgcolor: "primary.light",
                backgroundImage: `url(${campaign.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
                mb: 3,
              }}
            />
            <Chip label={campaign.category} color="primary" sx={{ mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {campaign.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              By {campaign.createdBy?.name}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Campaign Story
            </Typography>
            <Typography variant="body1" paragraph>
              {campaign.description}
            </Typography>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Recent Donations
            </Typography>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <Box
                  key={donation._id}
                  sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {donation.isAnonymous ? "Anonymous" : donation.donor?.name}{" "}
                    donated ${donation.amount}
                  </Typography>
                  {donation.message && (
                    <Typography variant="body2" color="text.secondary">
                      {donation.message}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No donations yet. Be the first!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 20 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                ${campaign.currentAmount}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                raised of ${campaign.goalAmount} goal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={campaign.progressPercentage}
                sx={{ height: 10, borderRadius: 5, my: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {campaign.progressPercentage}% • {campaign.daysRemaining} days
                remaining
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {user && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Make a Donation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your Balance: ${user.balance}
                </Typography>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
                <TextField
                  fullWidth
                  label="Message (optional)"
                  multiline
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  margin="normal"
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleDonate}
                  sx={{ mt: 2 }}
                  disabled={!donationAmount || donationAmount <= 0}
                >
                  Donate Now
                </Button>
              </Box>
            )}

            {!user && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Please login to make a donation
                </Typography>
                <Button variant="contained" href="/login">
                  Login
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CampaignDetailPage;
