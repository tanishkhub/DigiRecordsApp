import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/login`,
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/home"); // Redirect
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #f7f8fc, #e3e7ed)",
      }}
    >
      <GoogleTranslateComponent />
      <Container maxWidth="xs">
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            backdropFilter: "blur(8px)",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            textAlign: "center",
            color: "#333",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
          >
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={handleChange}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.6)",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#555" },
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={handleChange}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.6)",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#555" },
                },
              }}
            />
            {error && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "1rem",
                bgcolor: "#556cd6",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                transition: "0.3s",
                "&:hover": { bgcolor: "#3f51b5" },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
