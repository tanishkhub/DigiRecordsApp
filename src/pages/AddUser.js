import React, { useEffect, useState } from "react";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Grow,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  MenuItem,
  InputAdornment,
  Toolbar,
  Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Delete, Add, Close, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PreviewDialog from "../components/PreviewDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddUser = () => {
  // Field structure & form data state
  const [fields, setFields] = useState({});
  const [formData, setFormData] = useState({
    generalInfo: {},
    familyMembers: [],
    additionalInfo: "",
  });
  const navigate = useNavigate();

  const handleArrowClick = () => {
    navigate("/home");
  };

  // Dialog states for existing and new dialogs
  const [openFamilyDialog, setOpenFamilyDialog] = useState(false);
  const [openEditGeneralDialog, setOpenEditGeneralDialog] = useState(false);
  const [openEditFamilyDialog, setOpenEditFamilyDialog] = useState(false);
  const [openWardDialog, setOpenWardDialog] = useState(false);
  const [openEducationDialog, setOpenEducationDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState("");

  // New dialogs for additional fields
  const [openCasteDialog, setOpenCasteDialog] = useState(false);
  const [openSubCasteDialog, setOpenSubCasteDialog] = useState(false);
  const [openGotraDialog, setOpenGotraDialog] = useState(false);
  const [openDistrictDialog, setOpenDistrictDialog] = useState(false);
  const [openTehsilDialog, setOpenTehsilDialog] = useState(false);

  // Temporary states for form/dialog inputs
  const [familyMemberForm, setFamilyMemberForm] = useState({});
  const [newGeneralField, setNewGeneralField] = useState("");
  const [newFamilyField, setNewFamilyField] = useState("");

  // States for Wards and Education (existing)
  const [wards, setWards] = useState([]);
  const [newWardName, setNewWardName] = useState("");
  const [educationOptions, setEducationOptions] = useState([]);
  const [newEducationName, setNewEducationName] = useState("");

  // States for additional fields
  const [castes, setCastes] = useState([]);
  const [newCasteName, setNewCasteName] = useState("");

  const [subCastes, setSubCastes] = useState([]);
  const [newSubCasteName, setNewSubCasteName] = useState("");

  const [gotras, setGotras] = useState([]);
  const [newGotraName, setNewGotraName] = useState("");

  const [districts, setDistricts] = useState([]);
  const [newDistrictName, setNewDistrictName] = useState("");

  const [tehsils, setTehsils] = useState([]);
  const [newTehsilName, setNewTehsilName] = useState("");

  // State for preview dialog
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  // Fetch field structure from API
  const fetchFields = () => {
    axios
      .get(`${API_BASE_URL}/api/fields`)
      .then((response) => {
        console.log("Fields API Response:", response.data);
        setFields(response.data || {});
      })
      .catch((error) => console.error("Error fetching fields:", error));
  };

  // Fetch wards from API
  const fetchWards = () => {
    axios
      .get(`${API_BASE_URL}/api/wards/all`)
      .then((response) => {
        setWards(response.data);
      })
      .catch((error) => console.error("Error fetching wards:", error));
  };

  // Fetch education options from API
  const fetchEducationOptions = () => {
    axios
      .get(`${API_BASE_URL}/api/education/all`)
      .then((response) => {
        setEducationOptions(response.data);
      })
      .catch((error) =>
        console.error("Error fetching education options:", error)
      );
  };

  // Fetch additional fields from API
  const fetchCastes = () => {
    axios
      .get(`${API_BASE_URL}/api/caste/all`)
      .then((response) => setCastes(response.data))
      .catch((error) => console.error("Error fetching castes:", error));
  };

  const fetchSubCastes = () => {
    axios
      .get(`${API_BASE_URL}/api/subcaste/all`)
      .then((response) => setSubCastes(response.data))
      .catch((error) => console.error("Error fetching sub castes:", error));
  };

  const fetchGotras = () => {
    axios
      .get(`${API_BASE_URL}/api/gotra/all`)
      .then((response) => setGotras(response.data))
      .catch((error) => console.error("Error fetching gotras:", error));
  };

  const fetchDistricts = () => {
    axios
      .get(`${API_BASE_URL}/api/district/all`)
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const fetchTehsils = () => {
    axios
      .get(`${API_BASE_URL}/api/tehsil/all`)
      .then((response) => setTehsils(response.data))
      .catch((error) => console.error("Error fetching tehsils:", error));
  };

  useEffect(() => {
    fetchFields();
    fetchWards();
    fetchEducationOptions();
    fetchCastes();
    fetchSubCastes();
    fetchGotras();
    fetchDistricts();
    fetchTehsils();
  }, []);

  // Handle input changes for general info & additional info
  const handleInputChange = (section, field, value) => {
    if (section === "generalInfo") {
      setFormData((prev) => ({
        ...prev,
        generalInfo: { ...prev.generalInfo, [field]: value },
      }));
    } else if (section === "additionalInfo") {
      setFormData((prev) => ({ ...prev, additionalInfo: value }));
    }
  };

  // Handle changes for new family member dialog
  const handleFamilyMemberInputChange = (field, value) => {
    setFamilyMemberForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save new family member and close dialog
  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, familyMemberForm],
    }));
    setFamilyMemberForm({});
    setOpenFamilyDialog(false);
  };

  // Remove a family member row
  const removeFamilyMember = (index) => {
    setFormData((prev) => {
      const updatedFamily = prev.familyMembers.filter((_, i) => i !== index);
      return { ...prev, familyMembers: updatedFamily };
    });
  };

  // --- General Fields Edit Handlers ---
  const handleAddGeneralField = () => {
    if (!newGeneralField.trim()) {
      alert("Field name cannot be empty");
      return;
    }
    if (fields.generalInfo?.includes(newGeneralField)) {
      alert("Field already exists in General Information");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/fields/add`, {
        category: "generalInfo",
        newFields: [newGeneralField],
      })
      .then(() => {
        alert(
          `Field '${newGeneralField}' added to General Information successfully!`
        );
        fetchFields();
        setNewGeneralField("");
      })
      .catch((error) => console.error("Error adding general field:", error));
  };

  const handleRemoveGeneralField = (fieldName) => {
    axios
      .post(`${API_BASE_URL}/api/fields/remove`, {
        category: "generalInfo",
        removeFields: [fieldName],
      })
      .then(() => {
        alert(
          `Field '${fieldName}' removed from General Information successfully!`
        );
        fetchFields();
      })
      .catch((error) => console.error("Error removing general field:", error));
  };

  // --- Family Fields Edit Handlers ---
  const handleAddFamilyField = () => {
    if (!newFamilyField.trim()) {
      alert("Field name cannot be empty");
      return;
    }
    if (fields.familyMembers?.includes(newFamilyField)) {
      alert("Field already exists in Family Members");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/fields/add`, {
        category: "familyMembers",
        newFields: [newFamilyField],
      })
      .then(() => {
        alert(
          `Field '${newFamilyField}' added to Family Members successfully!`
        );
        fetchFields();
        setNewFamilyField("");
      })
      .catch((error) =>
        console.error("Error adding family field:", error)
      );
  };

  const handleRemoveFamilyField = (fieldName) => {
    axios
      .post(`${API_BASE_URL}/api/fields/remove`, {
        category: "familyMembers",
        removeFields: [fieldName],
      })
      .then(() => {
        alert(
          `Field '${fieldName}' removed from Family Members successfully!`
        );
        fetchFields();
      })
      .catch((error) =>
        console.error("Error removing family field:", error)
      );
  };

  // --- Ward CRUD Handlers (existing) ---
  const addWard = () => {
    if (!newWardName.trim()) {
      alert("Ward name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/wards/add`, { name: newWardName })
      .then(() => {
        alert("Ward added successfully!");
        setNewWardName("");
        fetchWards();
      })
      .catch((error) => console.error("Error adding ward:", error));
  };

  const deleteWard = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/wards/delete/${id}`)
      .then(() => {
        alert("Ward deleted successfully!");
        fetchWards();
      })
      .catch((error) => console.error("Error deleting ward:", error));
  };

  // --- Education CRUD Handlers (existing) ---
  const addEducation = () => {
    if (!newEducationName.trim()) {
      alert("Education name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/education/add`, { name: newEducationName })
      .then(() => {
        alert("Education option added successfully!");
        setNewEducationName("");
        fetchEducationOptions();
      })
      .catch((error) =>
        console.error("Error adding education option:", error)
      );
  };

  const deleteEducation = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/education/delete/${id}`)
      .then(() => {
        alert("Education option deleted successfully!");
        fetchEducationOptions();
      })
      .catch((error) =>
        console.error("Error deleting education option:", error)
      );
  };

  // --- Additional Fields CRUD Handlers ---
  // Caste
  const addCaste = () => {
    if (!newCasteName.trim()) {
      alert("Caste name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/caste/add`, { name: newCasteName })
      .then(() => {
        alert("Caste added successfully!");
        setNewCasteName("");
        fetchCastes();
      })
      .catch((error) => console.error("Error adding caste:", error));
  };

  const deleteCaste = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/caste/delete/${id}`)
      .then(() => {
        alert("Caste deleted successfully!");
        fetchCastes();
      })
      .catch((error) => console.error("Error deleting caste:", error));
  };

  // Sub Caste
  const addSubCaste = () => {
    if (!newSubCasteName.trim()) {
      alert("Sub Caste name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/subcaste/add`, { name: newSubCasteName })
      .then(() => {
        alert("Sub Caste added successfully!");
        setNewSubCasteName("");
        fetchSubCastes();
      })
      .catch((error) => console.error("Error adding sub caste:", error));
  };

  const deleteSubCaste = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/subcaste/delete/${id}`)
      .then(() => {
        alert("Sub Caste deleted successfully!");
        fetchSubCastes();
      })
      .catch((error) => console.error("Error deleting sub caste:", error));
  };

  // Gotra
  const addGotra = () => {
    if (!newGotraName.trim()) {
      alert("Gotra name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/gotra/add`, { name: newGotraName })
      .then(() => {
        alert("Gotra added successfully!");
        setNewGotraName("");
        fetchGotras();
      })
      .catch((error) => console.error("Error adding gotra:", error));
  };

  const deleteGotra = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/gotra/delete/${id}`)
      .then(() => {
        alert("Gotra deleted successfully!");
        fetchGotras();
      })
      .catch((error) => console.error("Error deleting gotra:", error));
  };

  // District
  const addDistrict = () => {
    if (!newDistrictName.trim()) {
      alert("District name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/district/add`, { name: newDistrictName })
      .then(() => {
        alert("District added successfully!");
        setNewDistrictName("");
        fetchDistricts();
      })
      .catch((error) => console.error("Error adding district:", error));
  };

  const deleteDistrict = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/district/delete/${id}`)
      .then(() => {
        alert("District deleted successfully!");
        fetchDistricts();
      })
      .catch((error) => console.error("Error deleting district:", error));
  };

  // Tehsil
  const addTehsil = () => {
    if (!newTehsilName.trim()) {
      alert("Tehsil name cannot be empty");
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/tehsil/add`, { name: newTehsilName })
      .then(() => {
        alert("Tehsil added successfully!");
        setNewTehsilName("");
        fetchTehsils();
      })
      .catch((error) => console.error("Error adding tehsil:", error));
  };

  const deleteTehsil = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/tehsil/delete/${id}`)
      .then(() => {
        alert("Tehsil deleted successfully!");
        fetchTehsils();
      })
      .catch((error) => console.error("Error deleting tehsil:", error));
  };

  // --- Final Submission Function ---
  const handleFinalSubmit = () => {
    const submissionData = {
      ...formData,
      familyCount: formData.familyMembers.length,
    };

    if (
      fields.generalInfo &&
      fields.generalInfo.includes("Number of Family Members")
    ) {
      submissionData.generalInfo["Number of Family Members"] =
        formData.familyMembers.length;
    }
    
    axios
      .post(`${API_BASE_URL}/api/users/add`, submissionData)
      .then((response) => {
        const userId = response.data.userId;
        setRegisteredUserId(userId);
        setOpenSuccessDialog(true);
        // Reset form data and close the preview dialog
        setFormData({
          generalInfo: {},
          familyMembers: [],
          additionalInfo: "",
        });
        setOpenPreviewDialog(false);
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
        alert("Failed to save user data. Please try again.");
      });
  };

  // --- Preview Submission Handler ---
  const handlePreviewSubmit = (e) => {
    e.preventDefault();
    setOpenPreviewDialog(true);
  };

  // Extract fields for each section
  const generalFields = fields?.generalInfo || [];
  const familyFields = fields?.familyMembers || [];
  const additionalFieldPlaceholder = fields?.additionalInfo || "";

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Toolbar>
        <Tooltip title="Go Back">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back to home"
            onClick={handleArrowClick}
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <GoogleTranslateComponent />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            borderBottom: "3px solid",
            borderColor: "secondary.main",
            display: "auto",
            paddingBottom: "8px",
          }}
        >
          Parivarik Vistrit Jankari
        </Typography>
        <form onSubmit={handlePreviewSubmit}>
          {/* --- General Information Section --- */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 3, mb: 2 }}
          >
            <Typography variant="h5">General Information</Typography>
            <Tooltip title="Edit General Fields">
              <IconButton
                size="small"
                onClick={() => setOpenEditGeneralDialog(true)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Grid container spacing={2}>
            {generalFields.map((field, index) => {
              if (field === "Number of Family Members") return null;
              if (field === "Job Type (Private/Govt)") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={field}
                      value={formData.generalInfo[field] || ""}
                      onChange={(e) =>
                        handleInputChange("generalInfo", field, e.target.value)
                      }
                      variant="outlined"
                    >
                      <MenuItem value="Private">Private</MenuItem>
                      <MenuItem value="Government">Government</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                );
              } else if (field === "Monthly Income") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      size="small"
                      label={field}
                      value={formData.generalInfo[field] || ""}
                      onChange={(e) =>
                        handleInputChange("generalInfo", field, e.target.value)
                      }
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                );
              } else if (field === "Specially Abled (true/false)") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={field}
                      value={formData.generalInfo[field] || "No"}
                      onChange={(e) =>
                        handleInputChange("generalInfo", field, e.target.value)
                      }
                      variant="outlined"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  </Grid>
                );
              } else if (field === "Ward/Muhalla Name") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {wards.map((ward) => (
                          <MenuItem key={ward._id} value={ward.name}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Wards">
                        <IconButton
                          size="small"
                          onClick={() => setOpenWardDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "Education") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {educationOptions.map((edu) => (
                          <MenuItem key={edu._id} value={edu.name}>
                            {edu.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Education Options">
                        <IconButton
                          size="small"
                          onClick={() => setOpenEducationDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "Caste") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {castes.map((caste) => (
                          <MenuItem key={caste._id} value={caste.name}>
                            {caste.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Castes">
                        <IconButton
                          size="small"
                          onClick={() => setOpenCasteDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "Sub Caste") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {subCastes.map((subCaste) => (
                          <MenuItem key={subCaste._id} value={subCaste.name}>
                            {subCaste.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Sub Castes">
                        <IconButton
                          size="small"
                          onClick={() => setOpenSubCasteDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "Gotra") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {gotras.map((gotra) => (
                          <MenuItem key={gotra._id} value={gotra.name}>
                            {gotra.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Gotras">
                        <IconButton
                          size="small"
                          onClick={() => setOpenGotraDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "District") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {districts.map((district) => (
                          <MenuItem key={district._id} value={district.name}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Districts">
                        <IconButton
                          size="small"
                          onClick={() => setOpenDistrictDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else if (field === "Tehsil") {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex">
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={field}
                        value={formData.generalInfo[field] || ""}
                        onChange={(e) =>
                          handleInputChange("generalInfo", field, e.target.value)
                        }
                        variant="outlined"
                      >
                        {tehsils.map((tehsil) => (
                          <MenuItem key={tehsil._id} value={tehsil.name}>
                            {tehsil.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Tooltip title="Manage Tehsils">
                        <IconButton
                          size="small"
                          onClick={() => setOpenTehsilDialog(true)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                );
              } else {
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      size="small"
                      label={field}
                      variant="outlined"
                      value={formData.generalInfo[field] || ""}
                      onChange={(e) =>
                        handleInputChange("generalInfo", field, e.target.value)
                      }
                    />
                  </Grid>
                );
              }
            })}
          </Grid>

          {/* --- Family Members Section --- */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 3, mb: 2 }}
          >
            <Typography variant="h5">
              Family Members ({formData.familyMembers.length})
            </Typography>
            <Box>
              <Tooltip title="Edit Family Fields">
                <IconButton
                  size="small"
                  onClick={() => setOpenEditFamilyDialog(true)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {familyFields.map((field, index) => (
                    <TableCell key={index}>{field}</TableCell>
                  ))}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.familyMembers.map((member, memberIndex) => (
                  <TableRow key={memberIndex}>
                    {familyFields.map((field, index) => (
                      <TableCell key={index}>{member[field] || "-"}</TableCell>
                    ))}
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFamilyMember(memberIndex)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Tooltip title="Add Family Member">
            <Button
              sx={{ mt: 5 }}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setOpenFamilyDialog(true)}
              startIcon={<Add fontSize="small" />}
              style={{
                borderRadius: "20px",
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "#fff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s, transform 0.3s",
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#115293";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#1976d2";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Add Family Member
            </Button>
          </Tooltip>

          {/* --- Additional Information Section --- */}
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Additional Information
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            variant="outlined"
            placeholder={additionalFieldPlaceholder}
            value={formData.additionalInfo}
            onChange={(e) =>
              handleInputChange("additionalInfo", null, e.target.value)
            }
          />

          {/* --- Submit Button --- */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" type="submit" size="medium">
              Save Data
            </Button>
          </Box>
        </form>
      </Paper>

      {/* --- Edit General Fields Dialog --- */}
      <Dialog
        open={openEditGeneralDialog}
        onClose={() => setOpenEditGeneralDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit General Fields</DialogTitle>
        <DialogContent>
          {generalFields.map((field, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography>{field}</Typography>
              <Tooltip title="Remove Field">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveGeneralField(field)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          <TextField
            fullWidth
            size="small"
            label="New General Field"
            variant="outlined"
            value={newGeneralField}
            onChange={(e) => setNewGeneralField(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Tooltip title="Add Field">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleAddGeneralField}
                startIcon={<Add fontSize="small" />}
              >
                Add Field
              </Button>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenEditGeneralDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Edit Family Fields Dialog --- */}
      <Dialog
        open={openEditFamilyDialog}
        onClose={() => setOpenEditFamilyDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Family Fields</DialogTitle>
        <DialogContent>
          {familyFields.map((field, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography>{field}</Typography>
              <Tooltip title="Remove Field">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveFamilyField(field)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          <TextField
            fullWidth
            size="small"
            label="New Family Field"
            variant="outlined"
            value={newFamilyField}
            onChange={(e) => setNewFamilyField(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Tooltip title="Add Field">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleAddFamilyField}
                startIcon={<Add fontSize="small" />}
              >
                Add Field
              </Button>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenEditFamilyDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Add Family Member Dialog --- */}
      <Dialog
        open={openFamilyDialog}
        onClose={() => setOpenFamilyDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Family Member</DialogTitle>
<DialogContent>
  <Grid container spacing={2}>
    {familyFields.map((field, index) => {
      if (field === "Relation") {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              select
              fullWidth
              size="small"
              label={field}
              value={familyMemberForm[field] || ""}
              onChange={(e) =>
                handleFamilyMemberInputChange(field, e.target.value)
              }
              variant="outlined"
            >
              <MenuItem value="Self">Self</MenuItem>
              <MenuItem value="Father">Father</MenuItem>
              <MenuItem value="Mother">Mother</MenuItem>
              <MenuItem value="Wife">Wife</MenuItem>
              <MenuItem value="Son">Son</MenuItem>
              <MenuItem value="Daughter">Daughter</MenuItem>
              <MenuItem value="Niece/Nephew">Niece/Nephew</MenuItem>
              <MenuItem value="Grandson">Grandson</MenuItem>
              <MenuItem value="Granddaughter">Granddaughter</MenuItem>
              <MenuItem value="Grandfather">Grandfather</MenuItem>
              <MenuItem value="Grandmother">Grandmother</MenuItem>
            </TextField>
          </Grid>
        );
      } else if (field === "Gender") {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              select
              fullWidth
              size="small"
              label={field}
              value={familyMemberForm[field] || ""}
              onChange={(e) =>
                handleFamilyMemberInputChange(field, e.target.value)
              }
              variant="outlined"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>
        );
      } else if (field === "Specially Abled ") {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              select
              fullWidth
              size="small"
              label={field}
              value={familyMemberForm[field] || "No"}
              onChange={(e) =>
                handleFamilyMemberInputChange(field, e.target.value)
              }
              variant="outlined"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>
        );
      } else if (field === "Education") {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <Box display="flex">
              <TextField
                select
                fullWidth
                size="small"
                label={field}
                value={familyMemberForm[field] || ""}
                onChange={(e) =>
                  handleFamilyMemberInputChange(field, e.target.value)
                }
                variant="outlined"
              >
                {educationOptions.map((edu) => (
                  <MenuItem key={edu._id} value={edu.name}>
                    {edu.name}
                  </MenuItem>
                ))}
              </TextField>
              <Tooltip title="Manage Education Options">
                <IconButton
                  size="small"
                  onClick={() => setOpenEducationDialog(true)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        );
      } else if (field === "Marital Status") {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              select
              fullWidth
              size="small"
              label={field}
              value={familyMemberForm[field] || ""}
              onChange={(e) =>
                handleFamilyMemberInputChange(field, e.target.value)
              }
              variant="outlined"
            >
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
            </TextField>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              fullWidth
              size="small"
              label={field}
              variant="outlined"
              value={familyMemberForm[field] || ""}
              onChange={(e) =>
                handleFamilyMemberInputChange(field, e.target.value)
              }
            />
          </Grid>
        );
      }
    })}
  </Grid>
</DialogContent>

        <DialogActions>
          <Tooltip title="Save Family Member">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={addFamilyMember}
              startIcon={<Add fontSize="small" />}
            >
              Save Family Member
            </Button>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              onClick={() => setOpenFamilyDialog(false)}
              color="secondary"
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>

      {/* --- Ward Management Dialog --- */}
      <Dialog
        open={openWardDialog}
        onClose={() => setOpenWardDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Wards</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Ward Name"
            variant="outlined"
            value={newWardName}
            onChange={(e) => setNewWardName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addWard} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Ward
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ward Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wards.map((ward) => (
                  <TableRow key={ward._id}>
                    <TableCell>{ward.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteWard(ward._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenWardDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Education Management Dialog --- */}
      <Dialog
        open={openEducationDialog}
        onClose={() => setOpenEducationDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Education Options</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Education Option"
            variant="outlined"
            value={newEducationName}
            onChange={(e) => setNewEducationName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addEducation} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Education Option
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Education Option</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {educationOptions.map((edu) => (
                  <TableRow key={edu._id}>
                    <TableCell>{edu.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteEducation(edu._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenEducationDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Manage Castes Dialog --- */}
      <Dialog
        open={openCasteDialog}
        onClose={() => setOpenCasteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Castes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Caste Name"
            variant="outlined"
            value={newCasteName}
            onChange={(e) => setNewCasteName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addCaste} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Caste
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Caste Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {castes.map((caste) => (
                  <TableRow key={caste._id}>
                    <TableCell>{caste.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteCaste(caste._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenCasteDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Manage Sub Castes Dialog --- */}
      <Dialog
        open={openSubCasteDialog}
        onClose={() => setOpenSubCasteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Sub Castes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Sub Caste Name"
            variant="outlined"
            value={newSubCasteName}
            onChange={(e) => setNewSubCasteName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addSubCaste} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Sub Caste
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sub Caste Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subCastes.map((subCaste) => (
                  <TableRow key={subCaste._id}>
                    <TableCell>{subCaste.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteSubCaste(subCaste._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenSubCasteDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Manage Gotras Dialog --- */}
      <Dialog
        open={openGotraDialog}
        onClose={() => setOpenGotraDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Gotras</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Gotra Name"
            variant="outlined"
            value={newGotraName}
            onChange={(e) => setNewGotraName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addGotra} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Gotra
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Gotra Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gotras.map((gotra) => (
                  <TableRow key={gotra._id}>
                    <TableCell>{gotra.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteGotra(gotra._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenGotraDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Manage Districts Dialog --- */}
      <Dialog
        open={openDistrictDialog}
        onClose={() => setOpenDistrictDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Districts</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New District Name"
            variant="outlined"
            value={newDistrictName}
            onChange={(e) => setNewDistrictName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addDistrict} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add District
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>District Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {districts.map((district) => (
                  <TableRow key={district._id}>
                    <TableCell>{district.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteDistrict(district._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenDistrictDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* --- Manage Tehsils Dialog --- */}
      <Dialog
        open={openTehsilDialog}
        onClose={() => setOpenTehsilDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Tehsils</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="New Tehsil Name"
            variant="outlined"
            value={newTehsilName}
            onChange={(e) => setNewTehsilName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addTehsil} variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Tehsil
          </Button>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tehsil Name</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tehsils.map((tehsil) => (
                  <TableRow key={tehsil._id}>
                    <TableCell>{tehsil.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteTehsil(tehsil._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenTehsilDialog(false)}
            color="secondary"
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogActions>
      </Dialog>

{/* --- Success Dialog --- */}
<Dialog
  open={openSuccessDialog}
  onClose={() => setOpenSuccessDialog(false)}
  fullWidth
  maxWidth="xs"
>
  <DialogContent
    sx={{
      textAlign: "center",
      p: 4,
      background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
      borderRadius: "16px", // smoother, more rounded corners
      boxShadow: "0px 6px 24px rgba(0,0,0,0.15)", // enhanced shadow for a subtle lift
    }}
  >
    <Grow in={openSuccessDialog} style={{ transformOrigin: "50% 50%" }} timeout={1000}>
      <CheckCircleIcon
        color="success"
        sx={{
          fontSize: 80,
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      />
    </Grow>
    <Typography
      variant="h5"
      sx={{
        mt: 2,
        fontFamily: "'Permanent Marker', cursive",
        color: "#3f51b5",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        animation: "fadeIn 1.5s ease-in-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }}
    >
      Registered Successfully!
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        mt: 1,
        color: "#424242",
        fontWeight: 500,
        animation: "slideIn 1.5s ease-out",
        "@keyframes slideIn": {
          "0%": { transform: "translateX(-20px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      }}
    >
      <strong>Your Unique FamilyId </strong>
      
    </Typography>
    <Typography
      variant="h5"
      sx={{
        mt: 2,
        fontFamily: "'Permanent Marker', cursive",
        color: "#3f51b5",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        animation: "fadeIn 1.5s ease-in-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }}
    ><strong>{registeredUserId}</strong>
    </Typography>
 
  <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
    <Button
      onClick={() => setOpenSuccessDialog(false)}
      variant="contained"
      color="primary"
      sx={{
        px: 4,
        py: 1.5,
        fontSize: "1rem",
        textTransform: "none",
        borderRadius: "20px",
        transition: "background-color 0.3s, transform 0.3s",
        "&:hover": {
          backgroundColor: "#303f9f",
          transform: "scale(1.05)",
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
  </DialogContent>
</Dialog>


      {/* --- Render Preview Dialog Component --- */}
      <PreviewDialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        onConfirm={handleFinalSubmit}
        formData={formData}
        fields={fields}
      />
    </Container>
  );
};

export default AddUser;
