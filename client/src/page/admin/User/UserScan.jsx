import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  useTheme,
  Avatar,
} from "@mui/material";
import { tokens } from "../../../theme";
import { QrReader } from "react-qr-reader";
import { Link } from "react-router-dom";
import { Restore } from "@mui/icons-material";
const UserScan = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState("");

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
              Patient &#62; Scanner
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ width: "500px" }}>
          <QrReader
            ViewFinder="true"
            constraints={{
              facingMode: "environment",
            }}
            onResult={(result, error) => {
              if (!!result) {
                setData(result?.text);
              }

              if (!!error) {
                console.info(error);
              }
            }}
            style={{ width: "100%" }}
          />
        </Box>
        <Box sx={{ display: `${data ? "flex" : "none"}` }} gap={2}>
          <Link
            to={`/admin/patient/profile/${data}`}
            style={{
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Paper
              sx={{
                padding: "25px 25px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: colors.secondary[500],
                alignItems: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: colors.blackOnly[500],
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                patient ID
              </Typography>
              <Paper
                sx={{
                  mt: 2,
                  padding: "15px 25px",
                  borderRadius: "25px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.whiteOnly[500],
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: colors.blackOnly[500],
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  {data}
                </Typography>
              </Paper>
            </Paper>
          </Link>
        </Box>
        {data ? (
          <Button
            sx={{ mt: 2 }}
            type="button"
            variant="contained"
            startIcon={<Restore />}
            onClick={() => {
              window.location.reload(false);
            }}
          >
            Reset Scanner
          </Button>
        ) : (
          <></>
        )}
        ;
      </Paper>
    </Box>
  );
};

export default UserScan;
