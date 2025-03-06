import React, { useEffect, useState } from "react";
import GoogleTranslateComponent from "../components/GoogleTranslateComponent";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
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
} from "@mui/material";
import { Delete, Add, Close, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

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

  // Dialog states
  const [openFamilyDialog, setOpenFamilyDialog] = useState(false);
  const [openEditGeneralDialog, setOpenEditGeneralDialog] = useState(false);
  const [openEditFamilyDialog, setOpenEditFamilyDialog] = useState(false);
  const [openWardDialog, setOpenWardDialog] = useState(false);
  const [openEducationDialog, setOpenEducationDialog] = useState(false);

  // Temporary states for form/dialog inputs
  const [familyMemberForm, setFamilyMemberForm] = useState({});
  const [newGeneralField, setNewGeneralField] = useState("");
  const [newFamilyField, setNewFamilyField] = useState("");

  // State for wards
  const [wards, setWards] = useState([]);
  const [newWardName, setNewWardName] = useState("");

  // State for education options
  const [educationOptions, setEducationOptions] = useState([]);
  const [newEducationName, setNewEducationName] = useState("");

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

  useEffect(() => {
    fetchFields();
    fetchWards();
    fetchEducationOptions();
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

  // --- Ward CRUD Handlers ---
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

  // --- Education CRUD Handlers ---
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

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      familyCount: formData.familyMembers.length,
    };
    // Automatically set "Number of Family Members" if exists in general fields
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
        alert("User data saved successfully!");
        console.log("User Data Response:", response.data);
        setFormData({
          generalInfo: {},
          familyMembers: [],
          additionalInfo: "",
        });
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
        alert("Failed to save user data. Please try again.");
      });
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
        <form onSubmit={handleSubmit}>
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
              // Omit "Number of Family Members" from rendering
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
    </Container>
  );
};

export default AddUser;
