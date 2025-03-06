import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Divider,
  IconButton,
  ToggleButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewListIcon from "@mui/icons-material/ViewList";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import axios from "axios";

// Minimal print styles: no scaling or layout changes,
// plus a class to force page breaks after each user in scrollable view.
const PrintStyles = () => (
  <style>
    {`
      @media print {
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
        .page-break {
          page-break-after: always;
        }
      }
    `}
  </style>
);

const UserDetails = () => {
  const { id } = useParams();

  // Use useMemo to calculate uniqueIds only when 'id' changes
  const uniqueIds = useMemo(() => {
    return id.includes(",")
      ? [...new Set(id.split(",").map((item) => item.trim()))]
      : [id];
  }, [id]);

  // Determine if there are multiple unique ids
  const isMultiple = useMemo(() => uniqueIds.length > 1, [uniqueIds]);

  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // State for view mode: "paginated" or "scrollable"
  const [viewMode, setViewMode] = useState("paginated");
  // State to control the floating container's expand/collapse behavior
  const [toggleExpanded, setToggleExpanded] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (isMultiple) {
      // Single request with comma-separated unique IDs
      axios
        .get(`${API_BASE_URL}/api/users/${uniqueIds.join(",")}`)
        .then((res) => {
          setUsersData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setError("Error fetching users.");
          setLoading(false);
        });
    } else {
      axios
        .get(`${API_BASE_URL}/api/users/${id}`)
        .then((res) => {
          // Ensure we always have an array
          setUsersData(Array.isArray(res.data) ? res.data : [res.data]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setError("User not found or server error.");
          setLoading(false);
        });
    }
  }, [id, API_BASE_URL, uniqueIds, isMultiple]);

  const handleNext = () => {
    if (currentIndex < usersData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleViewModeChange = (newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!usersData.length) return null;

  // Helper function to render a single user's details.
  const renderUserDetails = (user) => {
    const general =
      user.generalInfo && user.generalInfo.length > 0
        ? user.generalInfo[0]
        : {};
    const generalKeys = Object.keys(general);

    // Dynamically determine table headers for family members.
    let familyColumns = [];
    if (user.familyMembers && user.familyMembers.length > 0) {
      familyColumns = Object.keys(user.familyMembers[0]);
    }

    return (
      <Box key={user._id || Math.random()} sx={{ mb: 4 }} className="page-break">
        {/* Form Heading */}
        <GoogleTranslateComponent />
        <Box textAlign="center" mb={2}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Kori Samaj Seva Mandal Sagar (M.P.)
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            Detailed Family Data
          </Typography>
        </Box>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 2, borderRadius: "8px", bgcolor: "background.paper" }}
        >
<Grid container spacing={2}>
  {generalKeys.map((key, index) => (
    <Grid item xs={4} key={index}>
      <Typography variant="subtitle2" color="textSecondary">
        {key}
      </Typography>
      <Typography variant="body1">
      {key === "Monthly Income"
        ? `₹ ${general[key] || ""}`
        : general[key] || ""}
      </Typography>
    </Grid>
  ))}
</Grid>

        </Paper>
        <Divider sx={{ my: 2 }} />
        

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
  <Typography
    variant="h5"
    component="h2"
    sx={{
      mb: 2,
      color: 'primary.main',
      fontWeight: 600,
      textAlign: 'center',
    }}
  >
    Family Members Information
  </Typography>
  <Table size="small" aria-label="family-members" sx={{ maxWidth: 600 }}>
    <TableHead>
      <TableRow>
        {familyColumns.map((col, index) => (
          <TableCell key={index} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {col}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {user.familyMembers &&
        user.familyMembers.map((member, rowIndex) => (
          <TableRow key={rowIndex}>
            {familyColumns.map((col, colIndex) => (
              <TableCell key={colIndex} sx={{ textAlign: 'center' }}>
                {member[col]}
              </TableCell>
            ))}
          </TableRow>
        ))}
    </TableBody>
  </Table>
</Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "secondary.main" }}>
            Additional Information:
          </Typography>
          <Typography variant="body1">
            {user.additionalInfo !== "N/A"
              ? user.additionalInfo
              : "No additional information provided"}
          </Typography>
        </Box>
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Typography variant="body2">
            Created At: {new Date(user.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Updated At: {new Date(user.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <PrintStyles />
      <Container
        maxWidth={false}
        sx={{
          width: "794px", // ~ A4 width at 96 DPI; adjust as needed
          margin: "0 auto",
          mt: 2,
          mb: 2,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: "8px",
          p: 2,
        }}
      >
        {viewMode === "paginated" ? (
          <>
            {renderUserDetails(usersData[currentIndex])}
          </>
        ) : (
          // Scrollable view: Render all user details on one long page.
          usersData.map((user) => renderUserDetails(user))
        )}
        {/* Navigation controls are rendered only for paginated view and hidden during printing */}
        {viewMode === "paginated" && usersData.length > 1 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ "@media print": { display: "none" } }}
          >
            <IconButton
              onClick={handlePrev}
              disabled={currentIndex === 0}
              sx={{
                borderRadius: "50%",
                transition: "all 0.3s ease-in-out",
                padding: "8px",
                "&:hover": {
                  borderRadius: "20px",
                  padding: "12px",
                },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {`User ${currentIndex + 1} of ${usersData.length}`}
            </Typography>
            <IconButton
              onClick={handleNext}
              disabled={currentIndex === usersData.length - 1}
              sx={{
                borderRadius: "50%",
                transition: "all 0.3s ease-in-out",
                padding: "8px",
                "&:hover": {
                  borderRadius: "20px",
                  padding: "12px",
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}
      </Container>

      {/* Floating container for view mode toggle buttons with collapse/expand logic */}
      <Box
        onMouseEnter={() => setToggleExpanded(true)}
        onMouseLeave={() => setToggleExpanded(false)}
        sx={{
          position: "fixed",
          top: 20, // Positioned at the top right
          right: 20,
          display: "flex",
          gap: toggleExpanded ? 1 : 0,
          zIndex: 1000,
          transition: "all 0.3s ease-in-out",
          borderRadius: toggleExpanded ? "50px" : "50%",
          backgroundColor: "background.paper",
          boxShadow: 3,
          p: toggleExpanded ? 0.5 : 0,
          width: toggleExpanded ? "auto" : "40px",
          height: toggleExpanded ? "auto" : "40px",
          overflow: "hidden",
          "@media print": { display: "none" },
        }}
      >
        <ToggleButton
          value="paginated"
          selected={viewMode === "paginated"}
          onChange={() => handleViewModeChange("paginated")}
          sx={{
            minWidth: toggleExpanded ? "140px" : "40px",
            borderRadius: toggleExpanded ? "20px" : "50%",
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
            padding: "8px",
            boxShadow: 3,
            bgcolor: viewMode === "paginated" ? "primary.main" : "grey.500",
            color: "white",
          }}
        >
          <TableRowsIcon />
          {toggleExpanded && (
            <Box
              component="span"
              sx={{
                ml: 1,
                whiteSpace: "nowrap",
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              Paginated View
            </Box>
          )}
        </ToggleButton>
        <ToggleButton
          value="scrollable"
          selected={viewMode === "scrollable"}
          onChange={() => handleViewModeChange("scrollable")}
          sx={{
            minWidth: toggleExpanded ? "140px" : "40px",
            borderRadius: toggleExpanded ? "20px" : "50%",
            transition: "all 0.3s ease-in-out",
            overflow: "hidden",
            padding: "8px",
            boxShadow: 3,
            bgcolor: viewMode === "scrollable" ? "primary.main" : "grey.500",
            color: "white",
          }}
        >
          <ViewListIcon />
          {toggleExpanded && (
            <Box
              component="span"
              sx={{
                ml: 1,
                whiteSpace: "nowrap",
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              Scrollable View
            </Box>
          )}
        </ToggleButton>
      </Box>
    </>
  );
};

export default UserDetails;
