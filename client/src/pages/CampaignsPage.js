import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  Box,
  Chip,
} from "@mui/material";
import API from "../api/axios";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await API.get("/campaigns");
      setCampaigns(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading campaigns...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          All Campaigns
        </Typography>
        <Button variant="contained" component={Link} to="/create-campaign">
          Create Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} sm={6} md={4} key={campaign._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  height: 200,
                  bgcolor: "primary.light",
                  backgroundImage: `url(${campaign.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Chip
                  label={campaign.category}
                  size="small"
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Typography gutterBottom variant="h6" component="h2">
                  {campaign.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {campaign.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.currentAmount} raised
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${campaign.goalAmount} goal
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={campaign.progressPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {campaign.progressPercentage}% funded •{" "}
                    {campaign.daysRemaining} days left
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/campaigns/${campaign._id}`}
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to={`/campaigns/${campaign._id}`}
                >
                  Donate
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {campaigns.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No campaigns found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CampaignsPage;
