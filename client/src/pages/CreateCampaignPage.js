import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CreateCampaignPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Others",
    goalAmount: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const categories = [
    "Medical",
    "Education",
    "Environment",
    "Animal Welfare",
    "Disaster Relief",
    "Others",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/campaigns", {
        ...formData,
        goalAmount: parseFloat(formData.goalAmount),
      });
      navigate(`/campaigns/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create campaign");
    }
  };

  if (user?.role !== "fundraiser" && user?.role !== "admin") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">
          Only fundraisers can create campaigns. Please update your role or
          contact an administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Campaign
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Campaign Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={6}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Tell your story and why you need support"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Goal Amount ($)"
            name="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" size="large" fullWidth>
              Create Campaign
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/campaigns")}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCampaignPage;
