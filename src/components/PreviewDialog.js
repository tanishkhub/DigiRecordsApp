import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const PreviewDialog = ({ open, onClose, onConfirm, formData, fields }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Preview User Data</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          General Information
        </Typography>
        {Object.keys(formData.generalInfo).map((key) => (
          <Typography key={key}>
            <strong>{key}:</strong> {formData.generalInfo[key]}
          </Typography>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Family Members
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              {fields.familyMembers &&
                fields.familyMembers.map((field, index) => (
                  <TableCell key={index}>{field}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.familyMembers &&
              formData.familyMembers.map((member, memberIndex) => (
                <TableRow key={memberIndex}>
                  {fields.familyMembers &&
                    fields.familyMembers.map((field, index) => (
                      <TableCell key={index}>
                        {member[field] || "-"}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Typography>{formData.additionalInfo || "N/A"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
