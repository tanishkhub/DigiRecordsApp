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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import { keyframes } from "@mui/system";
import EditUser from "../components/EditUser";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("individual");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Pagination state
  const [pageSize, setPageSize] = useState(10);

  // State for the EditUser dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  // --------------------
  // Filter States & Options
  // --------------------
  const [wardOptions, setWardOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]);
  const [subcasteOptions, setSubcasteOptions] = useState([]);
  const [gotraOptions, setGotraOptions] = useState([]);

  // Selected filter state variables
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedCaste, setSelectedCaste] = useState("");
  const [selectedSubcaste, setSelectedSubcaste] = useState("");
  const [selectedGotra, setSelectedGotra] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("");

  // Define static options for marital status and gender
  const maritalStatusOptions = ["Married", "Single", "Divorced"];
  const genderOptions = ["Male", "Female"];

  // Example ranges for age and salary
  const ageRanges = [
    { label: "0-18", min: 0, max: 18 },
    { label: "19-30", min: 19, max: 30 },
    { label: "31-50", min: 31, max: 50 },
    { label: "51+", min: 51, max: Infinity },
  ];

  const salaryRanges = [
    { label: "0-25000", min: 0, max: 25000 },
    { label: "25001-50000", min: 25001, max: 50000 },
    { label: "50001-100000", min: 50001, max: 100000 },
    { label: "100001+", min: 100001, max: Infinity },
  ];

  // --------------------
  // Fetch Options from Endpoints
  // --------------------
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/wards/all`)
      .then((res) => setWardOptions(res.data))
      .catch((err) => console.error("Error fetching wards:", err));

    axios
      .get(`${API_BASE_URL}/api/district/all`)
      .then((res) => setDistrictOptions(res.data))
      .catch((err) => console.error("Error fetching districts:", err));

    axios
      .get(`${API_BASE_URL}/api/tehsil/all`)
      .then((res) => setTehsilOptions(res.data))
      .catch((err) => console.error("Error fetching tehsils:", err));

    axios
      .get(`${API_BASE_URL}/api/caste/all`)
      .then((res) => setCasteOptions(res.data))
      .catch((err) => console.error("Error fetching castes:", err));

    axios
      .get(`${API_BASE_URL}/api/subcaste/all`)
      .then((res) => setSubcasteOptions(res.data))
      .catch((err) => console.error("Error fetching sub castes:", err));

    axios
      .get(`${API_BASE_URL}/api/gotra/all`)
      .then((res) => setGotraOptions(res.data))
      .catch((err) => console.error("Error fetching gotras:", err));
  }, [API_BASE_URL]);

  // --------------------
  // Fetch Data (Fields and Users)
  // --------------------
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

        // Create DataGrid column definitions:
        // First column now shows the parent's id (userId).
        const dynamicColumns = [
          {
            field: "userId",
            headerName: "ID",
            flex: 1,
          },
          ...familyMembersFields.map((fieldName) => {
            const normalizedField = fieldName.replace(/\s+/g, "");
            return {
              field: normalizedField,
              headerName: fieldName,
              flex: 1,
            };
          }),
        ];
        setColumns(dynamicColumns);

        // Process user data: normalize each family member object.
        const extractedFamilyData = usersRes.data.flatMap((user) =>
          user.familyMembers.map((member) => {
            const normalizedMember = { ...member };
            familyMembersFields.forEach((fieldName) => {
              const normalizedKey = fieldName.replace(/\s+/g, "");
              normalizedMember[normalizedKey] = member[fieldName];
            });
            // Optionally merge parent's generalInfo if needed for filtering
            if (user.generalInfo && user.generalInfo[0]) {
              const general = user.generalInfo[0];
              normalizedMember.wardMuhallaName = general["Ward/Muhalla Name"];
              normalizedMember.District = general["District"];
              normalizedMember.Tehsil = general["Tehsil"];
              normalizedMember.Caste = general["Caste"];
              normalizedMember.SubCaste = general["Sub Caste"];
              normalizedMember.Gotra = general["Gotra"];
              normalizedMember.MonthlyIncome = general["Monthly Income"];
            }
            return {
              ...normalizedMember,
              userId: user._id, // Parent's id used for grouping and navigation
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

  // --------------------
  // Filtering Logic: Combines search query and filter dropdown values.
  // --------------------
  useEffect(() => {
    let filtered = [...users];

    // Global text search
    if (searchQuery) {
      filtered = filtered.filter((member) =>
        Object.values(member).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by Ward/Muhalla
    if (selectedWard) {
      filtered = filtered.filter(
        (member) => member.wardMuhallaName === selectedWard
      );
    }
    // Filter by District
    if (selectedDistrict) {
      filtered = filtered.filter((member) => member.District === selectedDistrict);
    }
    // Filter by Tehsil
    if (selectedTehsil) {
      filtered = filtered.filter((member) => member.Tehsil === selectedTehsil);
    }
    // Filter by Caste
    if (selectedCaste) {
      filtered = filtered.filter((member) => member.Caste === selectedCaste);
    }
    // Filter by Sub Caste
    if (selectedSubcaste) {
      filtered = filtered.filter((member) => member.SubCaste === selectedSubcaste);
    }
    // Filter by Gotra (exclude same gotra)
    if (selectedGotra) {
      filtered = filtered.filter((member) => member.Gotra !== selectedGotra);
    }
    // Filter by Marital Status
    if (selectedMaritalStatus) {
      filtered = filtered.filter(
        (member) => member["Marital Status"] === selectedMaritalStatus
      );
    }
    // Filter by Gender
    if (selectedGender) {
      filtered = filtered.filter((member) => member.Gender === selectedGender);
    }
    // Filter by Age Range
    if (selectedAgeRange) {
      const range = ageRanges.find((r) => r.label === selectedAgeRange);
      if (range) {
        filtered = filtered.filter((member) => {
          const age = parseInt(member.Age, 10);
          return age >= range.min && age <= range.max;
        });
      }
    }
    // Filter by Salary Range
    if (selectedSalaryRange) {
      const range = salaryRanges.find((r) => r.label === selectedSalaryRange);
      if (range) {
        filtered = filtered.filter((member) => {
          const salary = parseInt(member.MonthlyIncome, 10);
          return salary >= range.min && salary <= range.max;
        });
      }
    }

    setFilteredData(filtered);
  }, [
    searchQuery,
    users,
    selectedWard,
    selectedDistrict,
    selectedTehsil,
    selectedCaste,
    selectedSubcaste,
    selectedGotra,
    selectedMaritalStatus,
    selectedGender,
    selectedAgeRange,
    selectedSalaryRange,
    ageRanges,
    salaryRanges,
  ]);

  // --------------------
  // Handlers for Row Actions
  // --------------------
  const handleEditSingle = () => {
    const selectedRowId = selectedRows[0];
    const selectedRow = users.find((member) => member.id === selectedRowId);
    if (selectedRow) {
      setEditUserId(selectedRow.userId);
      setEditDialogOpen(true);
    }
  };

  const handleRowClick = (params, event) => {
    event.stopPropagation();
    window.location.href = `/user/${params.row.userId}`;
  };

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = window.confirm(
      "This action cannot be reverted. Do you want to continue?"
    );
    if (!confirmed) return;

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
    window.location.href = `/user/${targetIds}`;
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

      {/* Combined Search and Filter Container */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "24px",
          maxWidth: "700px",
          margin: "0 auto",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Box display="flex" alignItems="center">
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
            }}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "#f9f9f9",
              },
            }}
          />
          <IconButton
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{ ml: 1 }}
          >
            <FilterListIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
        <Collapse in={showFilters}>
          <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Ward/Muhalla</InputLabel>
              <Select
                label="Ward/Muhalla"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {wardOptions.map((ward) => (
                  <MenuItem key={ward._id} value={ward.name}>
                    {ward.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>District</InputLabel>
              <Select
                label="District"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {districtOptions.map((district) => (
                  <MenuItem key={district._id} value={district.name}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tehsil</InputLabel>
              <Select
                label="Tehsil"
                value={selectedTehsil}
                onChange={(e) => setSelectedTehsil(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {tehsilOptions.map((tehsil) => (
                  <MenuItem key={tehsil._id} value={tehsil.name}>
                    {tehsil.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Caste</InputLabel>
              <Select
                label="Caste"
                value={selectedCaste}
                onChange={(e) => setSelectedCaste(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {casteOptions.map((caste) => (
                  <MenuItem key={caste._id} value={caste.name}>
                    {caste.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Sub Caste</InputLabel>
              <Select
                label="Sub Caste"
                value={selectedSubcaste}
                onChange={(e) => setSelectedSubcaste(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {subcasteOptions.map((subcaste) => (
                  <MenuItem key={subcaste._id} value={subcaste.name}>
                    {subcaste.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Gotra</InputLabel>
              <Select
                label="Gotra"
                value={selectedGotra}
                onChange={(e) => setSelectedGotra(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {gotraOptions.map((gotra) => (
                  <MenuItem key={gotra._id} value={gotra.name}>
                    {gotra.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Marital Status</InputLabel>
              <Select
                label="Marital Status"
                value={selectedMaritalStatus}
                onChange={(e) => setSelectedMaritalStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {maritalStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {genderOptions.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Age Range</InputLabel>
              <Select
                label="Age Range"
                value={selectedAgeRange}
                onChange={(e) => setSelectedAgeRange(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {ageRanges.map((range) => (
                  <MenuItem key={range.label} value={range.label}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Salary Range</InputLabel>
              <Select
                label="Salary Range"
                value={selectedSalaryRange}
                onChange={(e) => setSelectedSalaryRange(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {salaryRanges.map((range) => (
                  <MenuItem key={range.label} value={range.label}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Collapse>
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
          disableSelectionOnClick
          rows={filteredData}
          columns={columns}
          pageSize={pageSize}
          pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          onRowClick={handleRowClick}
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
