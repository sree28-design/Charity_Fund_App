import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  TextField,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Favorite,
  TrendingUp,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            p: 2,
            borderRadius: 2,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
  });
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const [balanceSuccess, setBalanceSuccess] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [donationsRes, statsRes, campaignsRes] = await Promise.all([
        API.get("/donations/my-donations"),
        API.get("/donations/stats"),
        API.get("/campaigns/my-campaigns"),
      ]);

      setDonations(donationsRes.data.data);
      setStats(statsRes.data.data);
      setCampaigns(campaignsRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleAddBalance = async () => {
    if (!addBalanceAmount || addBalanceAmount <= 0) return;

    try {
      const response = await API.put("/users/balance", {
        amount: parseFloat(addBalanceAmount),
      });

      updateUser({ ...user, balance: response.data.data.balance });
      setBalanceSuccess(
        `Successfully added $${addBalanceAmount} to your balance`
      );
      setAddBalanceAmount("");

      setTimeout(() => setBalanceSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding balance:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Here's an overview of your charitable activity
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Account Balance"
            value={`$${user?.balance || 0}`}
            icon={<AccountBalanceWallet />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Donated"
            value={`$${stats.totalDonated}`}
            icon={<Favorite />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Campaigns Supported"
            value={stats.campaignsSupported}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Campaigns"
            value={campaigns.length}
            icon={<CampaignIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Add Balance Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Balance
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add funds to your account for donations
            </Typography>
            {balanceSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {balanceSuccess}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={addBalanceAmount}
              onChange={(e) => setAddBalanceAmount(e.target.value)}
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddBalance}
              disabled={!addBalanceAmount || addBalanceAmount <= 0}
              sx={{ mt: 2 }}
            >
              Add Funds
            </Button>
          </Paper>
        </Grid>

        {/* Recent Donations */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Recent Donations</Typography>
              <Button component={Link} to="/campaigns">
                Browse Campaigns
              </Button>
            </Box>
            {donations.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Campaign</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donations.slice(0, 5).map((donation) => (
                      <TableRow key={donation._id}>
                        <TableCell>
                          {donation.campaign?.title || "N/A"}
                        </TableCell>
                        <TableCell>${donation.amount}</TableCell>
                        <TableCell>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={donation.status}
                            size="small"
                            color={
                              donation.status === "completed"
                                ? "success"
                                : "default"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No donations yet. Start supporting campaigns today!
                </Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/campaigns"
                  sx={{ mt: 2 }}
                >
                  Browse Campaigns
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* My Campaigns (for fundraisers) */}
        {(user?.role === "fundraiser" || user?.role === "admin") && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">My Campaigns</Typography>
                <Button
                  variant="contained"
                  component={Link}
                  to="/create-campaign"
                >
                  Create New Campaign
                </Button>
              </Box>
              {campaigns.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Goal</TableCell>
                        <TableCell>Raised</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                          <TableCell>{campaign.title}</TableCell>
                          <TableCell>{campaign.category}</TableCell>
                          <TableCell>${campaign.goalAmount}</TableCell>
                          <TableCell>${campaign.currentAmount}</TableCell>
                          <TableCell>{campaign.progressPercentage}%</TableCell>
                          <TableCell>
                            <Chip
                              label={campaign.status}
                              size="small"
                              color={
                                campaign.status === "active"
                                  ? "success"
                                  : campaign.status === "completed"
                                  ? "primary"
                                  : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              component={Link}
                              to={`/campaigns/${campaign._id}`}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    You haven't created any campaigns yet.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/create-campaign"
                    sx={{ mt: 2 }}
                  >
                    Create Your First Campaign
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
