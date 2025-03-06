// EditUser.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Close } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditUser = ({ id, isOpen, onClose }) => {
  // Initial state matching the backend response.
  const [formData, setFormData] = useState({
    generalInfo: [],
    familyMembers: [],
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for dropdown options
  const [wards, setWards] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);

  // Fetch user data when dialog is open.
  useEffect(() => {
    if (isOpen && id) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/api/users/${id}`)
        .then((response) => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [id, isOpen]);

  // Fetch wards
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/wards/all`)
      .then((response) => {
        setWards(response.data);
      })
      .catch((err) => {
        console.error("Error fetching wards:", err);
      });
  }, []);

  // Fetch education options
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/education/all`)
      .then((response) => {
        setEducationOptions(response.data);
      })
      .catch((err) => {
        console.error("Error fetching education options:", err);
      });
  }, []);

  // Update generalInfo. Since generalInfo is an array, we update its first object.
  const handleGeneralInfoChange = (field, value) => {
    setFormData((prev) => {
      const currentGeneral =
        Array.isArray(prev.generalInfo) && prev.generalInfo.length > 0
          ? prev.generalInfo[0]
          : {};
      const updatedGeneral = { ...currentGeneral, [field]: value };
      return { ...prev, generalInfo: [updatedGeneral] };
    });
  };

  // Handle additionalInfo change.
  const handleAdditionalInfoChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: value,
    }));
  };

  // Update a specific family member field.
  const handleFamilyMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, familyMembers: updatedMembers }));
  };

  // Remove a family member.
  const removeFamilyMember = (index) => {
    const updatedMembers = formData.familyMembers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, familyMembers: updatedMembers }));
  };

  // Update the user record.
  const handleUpdate = () => {
    axios
      .put(`${API_BASE_URL}/api/users/update/${id}`, formData)
      .then(() => {
        // Optionally, add a success message here.
        onClose();
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Extract generalInfo object (stored as an array).
  const generalInfoData =
    Array.isArray(formData.generalInfo) && formData.generalInfo.length > 0
      ? formData.generalInfo[0]
      : {};

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit User Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading user data...</Typography>
        ) : error ? (
          <Typography color="error">Error: {error.message}</Typography>
        ) : (
          <Box component="form" noValidate autoComplete="off">
            {/* General Information Section */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              General Information
            </Typography>
            <Grid container spacing={2}>
              {Object.keys(generalInfoData).map((field, index) => {
                // Render dropdown for Ward/Muhalla Name field.
                if (field === "Ward/Muhalla Name") {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        select
                        fullWidth
                        label={field}
                        value={generalInfoData[field] || ""}
                        onChange={(e) =>
                          handleGeneralInfoChange(field, e.target.value)
                        }
                        size="small"
                      >
                        {wards.map((ward) => (
                          <MenuItem key={ward._id} value={ward.name}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  );
                }
                // Render dropdown for Education field.
                if (field === "Education") {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        select
                        fullWidth
                        label={field}
                        value={generalInfoData[field] || ""}
                        onChange={(e) =>
                          handleGeneralInfoChange(field, e.target.value)
                        }
                        size="small"
                      >
                        {educationOptions.map((edu) => (
                          <MenuItem key={edu._id} value={edu.name}>
                            {edu.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  );
                }
                if (field === "Job Type (Private/Govt)") {
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        select
                        fullWidth
                        label={field}
                        value={generalInfoData[field] || ""}
                        onChange={(e) =>
                          handleGeneralInfoChange(field, e.target.value)
                        }
                        size="small"
                      >
                        <MenuItem value="Private">Private</MenuItem>
                        <MenuItem value="Govt">Govt</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </TextField>
                    </Grid>
                  );
                }
                if (field === "Number of Family Members") {
                  // Display count (read-only).
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <TextField
                        fullWidth
                        label={field}
                        value={
                          generalInfoData[field] || formData.familyMembers.length
                        }
                        disabled
                        size="small"
                      />
                    </Grid>
                  );
                }
                // Default text field.
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={field}
                      value={generalInfoData[field] || ""}
                      onChange={(e) =>
                        handleGeneralInfoChange(field, e.target.value)
                      }
                      size="small"
                    />
                  </Grid>
                );
              })}
            </Grid>

            {/* Family Members Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Family Members ({formData.familyMembers.length})
            </Typography>
            {formData.familyMembers.length > 0 ? (
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      {Object.keys(formData.familyMembers[0]).map((key, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minWidth: 150,
                          }}
                        >
                          {key}
                        </TableCell>
                      ))}
                      <TableCell
                        align="center"
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          minWidth: 100,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.familyMembers.map((member, memberIndex) => (
                      <TableRow key={memberIndex}>
                        {Object.keys(member).map((key, index) => {
                          // For family member Education field, render dropdown.
                          if (key === "Education") {
                            return (
                              <TableCell
                                key={index}
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                  minWidth: 150,
                                }}
                              >
                                <TextField
                                  select
                                  fullWidth
                                  value={member[key] || ""}
                                  onChange={(e) =>
                                    handleFamilyMemberChange(
                                      memberIndex,
                                      key,
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                >
                                  {educationOptions.map((edu) => (
                                    <MenuItem key={edu._id} value={edu.name}>
                                      {edu.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell>
                            );
                          }
                          // Default text field for other keys.
                          return (
                            <TableCell
                              key={index}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                minWidth: 150,
                              }}
                            >
                              <TextField
                                fullWidth
                                value={member[key] || ""}
                                onChange={(e) =>
                                  handleFamilyMemberChange(
                                    memberIndex,
                                    key,
                                    e.target.value
                                  )
                                }
                                size="small"
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell
                          align="center"
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minWidth: 100,
                          }}
                        >
                          <Tooltip title="Remove Family Member">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeFamilyMember(memberIndex)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No family members added.</Typography>
            )}

            {/* Additional Information Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Additional Information
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.additionalInfo || ""}
              onChange={(e) => handleAdditionalInfoChange(e.target.value)}
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          startIcon={<Close fontSize="small" />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          startIcon={<Edit fontSize="small" />}
        >
          Update Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
