import React from "react";
import { Container, Typography, Button, Box, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Make a Difference Today
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Support causes you care about and help create positive change in the
          world
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/campaigns"
            sx={{ mr: 2 }}
          >
            Browse Campaigns
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/create-campaign"
          >
            Start a Campaign
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary" gutterBottom>
              🎯
            </Typography>
            <Typography variant="h6" gutterBottom>
              Create Campaigns
            </Typography>
            <Typography color="text.secondary">
              Start fundraising campaigns for causes that matter to you
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary" gutterBottom>
              💝
            </Typography>
            <Typography variant="h6" gutterBottom>
              Donate Securely
            </Typography>
            <Typography color="text.secondary">
              Support campaigns with secure and transparent donations
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary" gutterBottom>
              📊
            </Typography>
            <Typography variant="h6" gutterBottom>
              Track Impact
            </Typography>
            <Typography color="text.secondary">
              Monitor your donations and campaign progress in real-time
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
