import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";

import LogoutIcon from "@mui/icons-material/Logout";

const Home = () => {
    const navigate = useNavigate();
  
    // Check if token exists, if not, redirect to login page
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/"); // Redirect to login if no token is found
      }
    }, [navigate]);
  
    // Logout function
    const handleLogout = () => {
      localStorage.removeItem("token"); // Remove token
      navigate("/"); // Redirect to login page
    };

  return (
    
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #f4f6f9, #d9e2ec)",
        textAlign: "center",
      }}
    >
      <GoogleTranslateComponent />
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#333" }}>
        Welcome, Admin
      </Typography>

      {/* Options */}
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Add User Card */}
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            cursor: "pointer",
            width: "220px",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)", background: "#f1f3f8" },
          }}
          onClick={() => navigate("/add-user")}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 50, color: "#3f51b5" }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Add User
          </Typography>
        </Paper>

        {/* View Users Card */}
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            cursor: "pointer",
            width: "220px",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)", background: "#f1f3f8" },
          }}
          onClick={() => navigate("/view-users")}
        >
          <FormatListBulletedIcon  sx={{ fontSize: 50, color: "#3f51b5" }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            View Users
          </Typography>
        </Paper>
      </Box>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outlined"
        startIcon={<LogoutIcon />}
        sx={{
          mt: 4,
          fontSize: "1rem",
          borderRadius: 2,
          color: "#ff3d00",
          borderColor: "#ff3d00",
          "&:hover": { background: "#ff3d00", color: "#fff" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Home;
