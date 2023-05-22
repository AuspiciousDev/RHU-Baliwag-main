import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "../../api/axios";

import ErrorDialogue from "../../global/ErrorDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";
import Navbar from "./components/Navbar";
const LOGIN_URL = "/auth";
const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
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

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  useEffect(() => {
    setErrMsg("");
  }, [email]);
  useEffect(() => {
    const inputs = document.querySelectorAll(".input");
    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((input) => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  });

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError) {
      try {
        setLoadingDialog({ isOpen: true });

        const forgotPass = await axios.post(
          "/api/auth/forgot-password",
          JSON.stringify({ email }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (forgotPass.status === 200) {
          setLoadingDialog({ isOpen: false });
          const json = await forgotPass.data;
          console.log("response;", json);
          setSuccessDialog({
            isOpen: true,
            message: `${json.message}`,
          });
          setEmailSent(true);
        }
      } catch (error) {
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          console.log("no server response");
        } else if (error.response.status === 400) {
          setFormError(true);
          setEmailError(true);
          setFormErrorMessage(error.response.data.message);
        } else if (error.response.status === 401) {
          setFormError(true);
          setEmailError(true);
          setFormErrorMessage(error.response.data.message);
        } else if (error.response.status === 500) {
          console.log(error.response.data.message);
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
        } else {
          console.log(error);
        }
      }
    } else {
      setErrorDialog({
        isOpen: true,
        message: `Please check your email.`,
      });
    }
  };
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
    mt: "1.5em",
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
      />
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
          elevation={2}
          className="container-login"
          sx={{ width: "35%", borderRadius: 5, justifyContent: "center" }}
        >
          {!emailSent ? (
            <form
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                maxWidth: "30em",
              }}
              onSubmit={handleSubmit}
            >
              <Box className="container-column" sx={{ gap: 5 }}>
                <Typography
                  variant="h1"
                  textAlign="start"
                  sx={{
                    marginBottom: 1,
                    borderLeft: `5px solid ${colors.secondary[500]}`,
                    paddingLeft: 3,
                    alignSelf: "start",
                  }}
                  textTransform="uppercase"
                >
                  Forgot Password
                </Typography>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email"
                  name="password"
                  variant="outlined"
                  className="register-input"
                  autoComplete="off"
                  value={email}
                  error={emailError}
                  onChange={(e) => {
                    setEmailError(false);
                    setFormError(false);
                    setEmail(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          "& > svg": {
                            color: colors.primary[100],
                          },
                        }}
                      >
                        <EmailOutlined />
                        <Divider
                          sx={{ height: 30, m: "0 .75em" }}
                          orientation="vertical"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {formError && (
                <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>
                  {formError && formErrorMessage}
                </Typography>
              )}
              <Button
                disabled={!email}
                variant="contained"
                fullWidth
                type="submit"
                sx={{ borderRadius: 4, height: 45, mt: "2em" }}
              >
                <Typography variant="h5" fontWeight="500" color="white">
                  Submit
                </Typography>
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mt: 2,
                  "& > a": {
                    color: colors.primary[100],
                    textDecoration: "none",
                  },
                }}
              >
                <Link to="/login">Login instead?</Link>
              </Box>
            </form>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                mt: 2,
                "& > a": {
                  color: colors.primary[500],
                  textDecoration: "none",
                },
              }}
            >
              <Typography>
                A mail has been sent to the email that you have provided, Please
                check your inbox or spam mail to reset your password.
              </Typography>

              <Divider sx={{ m: "1em 0" }} />
              <Link to="/">
                <span>Back to Home page</span>
              </Link>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
