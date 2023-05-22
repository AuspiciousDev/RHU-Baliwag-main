import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import ErrorDialogue from "../../global/ErrorDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";
import {
  Container,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import axios from "../../api/axios";
import {
  Lock,
  Person,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import Navbar from "./components/Navbar";
const ResetPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { resetToken } = useParams();
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confPasswordError, setConfPasswordError] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    if (password !== confPassword) {
      return (
        setError(true),
        setPasswordError(true),
        setConfPasswordError(true),
        setErrorMessage("Password doesn't match!"),
        console.log(errorMessage),
        setLoadingDialog({ isOpen: false }),
        setErrorDialog({
          isOpen: true,
          message: `Password doesn't match!`,
        })
      );
    }
    const data = {
      password,
    };
    console.log(data);
    if (!passwordError && !confPasswordError) {
      try {
        const response = await axios.post(
          "/api/auth/reset-password",
          JSON.stringify(data),
          {
            headers: {
              Authorization: `Bearer ${resetToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response);
        if (response.status === 200) {
          const json = await response.data;
          console.log("response;", json);

          setPassword("");
          setConfPassword("");
          setLoadingDialog({ isOpen: false });
          setPasswordChanged(true);
          setSuccessDialog({
            isOpen: true,
            // message: `Registration of ${json.userType} - ${json.username} Success!`,
            message: `${json.message}`,
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: ResetPassword.jsx:108 ~ handleSubmit ~ error",
          error
        );
        setLoadingDialog({ isOpen: false });
        if (!error.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
          setPasswordError(true);
          setConfPasswordError(true);

          console.log(error.response.data.message);
        } else if (error.response.status === 409) {
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
          setPasswordError(true);
          setConfPasswordError(true);
        } else {
          console.log(error);
        }
      }
    }
  };
  return (
    <Box
      className="container-page"
      sx={{
        flexDirection: "column",
        paddingLeft: 5,
        paddingRight: 5,
        background:
          "linear-gradient(180deg, rgba(124,223,184,0.5) 0%, rgba(255,255,255,1) 25%)",
      }}
    >
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />{" "}
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          height: "100%",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            width: "35%",
            borderRadius: 5,
            flexDirection: "column",
            padding: 5,
            borderRadius: 5,
            width: { xs: "100vmin", sm: "60vmin" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 1,
                borderRadius: 5,
                width: { xs: "100vmin", sm: "50vmin" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  borderLeft: `5px solid ${colors.secondary[500]}`,
                  paddingLeft: 2,
                }}
              >
                Reset your password
              </Typography>

              {!passwordChanged ? (
                <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                      required
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      name="password"
                      variant="outlined"
                      autoComplete="off"
                      value={password}
                      error={passwordError}
                      onChange={(e) => {
                        setError(false);
                        setFormError(false);
                        setPasswordError(false);
                        setConfPasswordError(false);
                        setPassword(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <VisibilityOutlined />
                              ) : (
                                <VisibilityOffOutlined />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      required
                      type={showPassword ? "text" : "password"}
                      name="confPassword"
                      label="Confirm Password"
                      variant="outlined"
                      autoComplete="off"
                      value={confPassword}
                      error={confPasswordError}
                      helperText={error ? errorMessage : ""}
                      onChange={(e) => {
                        setError(false);
                        setFormError(false);
                        setPasswordError(false);
                        setConfPasswordError(false);
                        setConfPassword(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <VisibilityOutlined />
                              ) : (
                                <VisibilityOffOutlined />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formError && (
                      <Typography
                        color="error"
                        variant="subtitle2"
                        sx={{ mt: 1 }}
                      >
                        {formError && formErrorMessage}
                      </Typography>
                    )}

                    <Button
                      disabled={passwordError || confPasswordError}
                      type="submit"
                      variant="contained"
                      sx={{ borderRadius: 4, height: 45, mt: "1em" }}
                    >
                      <Typography variant="h5" fontWeight="500" color="white">
                        Reset Password
                      </Typography>
                    </Button>
                  </Box>
                </form>
              ) : (
                <Box>
                  <Typography variant="h4">
                    Your password has been reset, You may now use your new
                    password to sign in.
                  </Typography>
                  <br />
                  <Divider />
                  <Box
                    className="container-footer"
                    sx={{
                      mt: 1,
                      "& > a": {
                        color: colors.black[100],
                        textDecoration: "none",
                      },
                    }}
                  >
                    <Link to="/">
                      <span>Sign in </span>
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResetPassword;
