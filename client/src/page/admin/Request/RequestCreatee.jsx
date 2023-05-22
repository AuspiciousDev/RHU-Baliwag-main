import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
const RequestCreatee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box className="container-layout_body_contents">
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          padding: { xs: "10px", sm: "0 10px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { sm: "end" },
              justifyContent: { xs: "center", sm: "start" },
              m: { xs: "20px 0" },
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                borderLeft: `5px solid ${colors.secondary[500]}`,
                paddingLeft: 2,
                textTransform: "uppercase",
              }}
            >
              Request &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequestCreatee;
