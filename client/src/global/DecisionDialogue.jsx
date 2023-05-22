import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
export const DecisionDialogue = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { decisionDialog, setDecisionDialog } = props;
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick")
      return setDecisionDialog({ ...decisionDialog, isOpen: false });
  };
  return (
    <Dialog
      sx={{ textAlign: "center" }}
      open={decisionDialog.isOpen}
      onClose={handleClose}
    >
      <DialogTitle sx={{ margin: "0 30px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CheckCircleOutlinedIcon
            sx={{ fontSize: "100px", color: colors.primary[500] }}
          />
          <Typography variant="h3">
            {decisionDialog?.title || "Changes has been made!"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ margin: "0 20px" }}>
        <Typography variant="h4">{decisionDialog.message}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: "10px",
          gap: 2,
          padding: "10px 50px",
        }}
      >
        {" "}
        <Button
          fullWidth
          variant="contained"
          color="error"
          //   onClick={() => setSuccessDialog({ ...successDialog, isOpen: false })}
          onClick={decisionDialog.onDeny}
        >
          Deny
        </Button>
        <Button
          fullWidth
          variant="contained"
          //   onClick={() => setSuccessDialog({ ...successDialog, isOpen: false })}
          onClick={decisionDialog.onConfirm}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DecisionDialogue;
