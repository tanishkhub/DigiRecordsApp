import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  InputAdornment,
  Switch,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import { keyframes } from "@mui/system";
import EditUser from "../components/EditUser"; // Import the EditUser dialog component

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Toggle viewMode with a switch ("individual" when off, "family" when on)
  const [viewMode, setViewMode] = useState("individual");
  const navigate = useNavigate();

  // Pagination state
  const [pageSize, setPageSize] = useState(10);

  // State for the EditUser dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const gradientAnimation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fields and users concurrently.
        const [fieldsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/fields`),
          axios.get(`${API_BASE_URL}/api/users`),
        ]);

        // Extract the familyMembers fields from the fields response.
        const familyMembersFields = fieldsRes.data.familyMembers;

        // Create DataGrid column definitions from familyMembers fields.
        const dynamicColumns = familyMembersFields.map((fieldName) => {
          const normalizedField = fieldName.replace(/\s+/g, "");
          return {
            field: normalizedField,
            headerName: fieldName,
            flex: 1,
          };
        });
        setColumns(dynamicColumns);

        // Process user data: normalize each family member object.
        const extractedFamilyData = usersRes.data.flatMap((user) =>
          user.familyMembers.map((member) => {
            const normalizedMember = { ...member };
            familyMembersFields.forEach((fieldName) => {
              const normalizedKey = fieldName.replace(/\s+/g, "");
              normalizedMember[normalizedKey] = member[fieldName];
            });
            return {
              ...normalizedMember,
              userId: user._id, // Used for grouping and navigation
              id: member._id || Math.random().toString(36).substr(2, 9),
            };
          })
        );

        setUsers(extractedFamilyData);
        setFilteredData(extractedFamilyData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // Floating edit button handler when a single row is selected.
  const handleEditSingle = () => {
    const selectedRowId = selectedRows[0];
    const selectedRow = users.find((member) => member.id === selectedRowId);
    if (selectedRow) {
      setEditUserId(selectedRow.userId);
      setEditDialogOpen(true);
    }
  };

  // Filter rows based on the search query.
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    setFilteredData(
      users.filter((member) =>
        Object.values(member).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowercasedQuery)
        )
      )
    );
  }, [searchQuery, users]);

  const handleRowClick = (params) => {
    navigate(`/user/${params.row.userId}`);
  };

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  // Delete handler with confirmation.
  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = window.confirm(
      "This action cannot be reverted. Do you want to continue?"
    );
    if (!confirmed) return;

    // Extract unique parent's ids from the selected rows.
    const parentIds = Array.from(
      new Set(
        users
          .filter((member) => selectedRows.includes(member.id))
          .map((member) => member.userId)
      )
    );

    try {
      await axios.delete(`${API_BASE_URL}/api/users`, {
        data: { ids: parentIds },
      });
      // Remove all rows belonging to the deleted parent's ids.
      const updatedUsers = users.filter(
        (member) => !parentIds.includes(member.userId)
      );
      setUsers(updatedUsers);
      setFilteredData(updatedUsers);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  // Handler for viewing details for multiple users.
  const handleViewDetails = () => {
    if (selectedRows.length === 0) return;
    const parentIds = Array.from(
      new Set(
        users
          .filter((member) => selectedRows.includes(member.id))
          .map((member) => member.userId)
      )
    );
    const targetIds = parentIds.join(",");
    navigate(`/user/${targetIds}`);
  };

  // Dynamic styling for family grouping.
  const familyColors = [
    "#e3f2fd",
    "#fce4ec",
    "#e8f5e9",
    "#fff3e0",
    "#f3e5f5",
    "#e0f7fa",
    "#ede7f6",
    "#f1f8e9",
  ];
  const uniqueFamilyIds = Array.from(new Set(users.map((member) => member.userId)));
  const familyColorMapping = {};
  uniqueFamilyIds.forEach((id, index) => {
    familyColorMapping[id] = familyColors[index % familyColors.length];
  });
  const dynamicCSS = uniqueFamilyIds
    .map(
      (id) =>
        `.MuiDataGrid-row.family-${id} { background-color: ${familyColorMapping[id]} !important; }`
    )
    .join("\n");

  // Handler for page size dropdown
  const handlePageSizeChange = (event) => {
    const value = event.target.value;
    setPageSize(Number(value));
  };

  return (
    <Container>
      <GoogleTranslateComponent />

      {viewMode === "family" && <style>{dynamicCSS}</style>}

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 3,
          background:
            "linear-gradient(270deg, rgb(25, 216, 230), rgb(28, 142, 241), rgb(26, 135, 203))",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `${gradientAnimation} 3s ease infinite`,
          letterSpacing: 2,
          textTransform: "uppercase",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Family Details
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 1,
          mb: 2,
          borderRadius: "50px",
          transition: "box-shadow 0.3s ease",
          ":hover": { boxShadow: 6 },
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "50px" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            },
          }}
        />
      </Paper>

      {/* Custom toolbar for view mode and pagination control */}
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={1}>
        <Typography variant="body2" sx={{ mr: 0.5 }}>
          Family Grouping
        </Typography>
        <Switch
          checked={viewMode === "family"}
          onChange={(e) =>
            setViewMode(e.target.checked ? "family" : "individual")
          }
          size="small"
        />
      </Box>

      {/* Floating action buttons */}
      {selectedRows.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            display: "flex",
            gap: "10px",
            zIndex: 1000,
          }}
        >
          <Tooltip title="Delete Selected">
            <IconButton onClick={handleDelete} sx={{ background: "white" }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {selectedRows.length > 1 && (
            <Tooltip title="View Details">
              <IconButton onClick={handleViewDetails} sx={{ background: "white" }}>
                <DescriptionIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {selectedRows.length === 1 && (
            <Tooltip title="Edit User">
              <IconButton onClick={handleEditSingle} sx={{ background: "white" }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      )}

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={pageSize}
          pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          onRowClick={handleRowClick}
          // Only add the family class when in "Family Grouping" mode.
          getRowClassName={(params) =>
            viewMode === "family" ? `family-${params.row.userId}` : ""
          }
          sx={{
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Integrate the EditUser dialog */}
      {editDialogOpen && (
        <EditUser
          id={editUserId}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        />
      )}
    </Container>
  );
};

export default ViewUsers;
