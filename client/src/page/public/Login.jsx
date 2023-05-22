import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { tokens } from "../../theme";
import {
  PersonOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingDialogue from "../../global/LoadingDialogue";
import ErrorDialogue from "../../global/ErrorDialogue";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
const Login = () => {
  const { auth, setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formError, setFormError] = useState(false);

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    if (!usernameError && !passwordError) {
      setLoadingDialog({ isOpen: true });
      try {
        const apiLogin = await axios.post(
          "/api/auth/login",
          JSON.stringify({ username, password })
        );
        if (apiLogin.status === 200) {
          setUsername("");
          setPassword("");
          const data = apiLogin?.data;
          const username = data?.username;
          const userType = data?.userType;
          const accessToken = data?.accessToken;
          const firstName = data?.firstName;
          const lastName = data?.lastName;
          const imgURL = data?.imgURL;
          setPersist(true);
          setAuth({
            username,
            userType,
            accessToken,
            firstName,
            lastName,
            imgURL,
          });
          from === "/" && userType === "admin"
            ? navigate("/admin", { replace: true })
            : from === "/" && userType === "user"
            ? navigate("/patient", { replace: true })
            : navigate(from, { replace: true });
        }
        localStorage.setItem("newLogin", true);

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: Login.jsx:109 ~ handleSubmit ~ error", error);
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response!`,
          });
        } else if (error.response.status === 401) {
          setUsernameError(true);
          setPasswordError(true);
          setFormError(true);
          setFormErrorMessage(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
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
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
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
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              maxWidth: "30em",
            }}
          >
            <Box className="container-column" sx={{ gap: 2.5, mt: 5 }}>
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
                Login
              </Typography>
              <TextField
                required
                fullWidth
                label="Username"
                variant="outlined"
                autoComplete="off"
                error={usernameError}
                value={username}
                onChange={(e) => {
                  if (isNumber(e.target.value)) {
                    setUsername(e.target.value);
                    setUsernameError(false);
                    setPasswordError(false);
                    setFormError(false);
                  }
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
                      <PersonOutlined />
                      <Divider
                        sx={{ height: 30, m: "0 .75em" }}
                        orientation="vertical"
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                autoComplete="off"
                error={passwordError}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setUsernameError(false);
                  setPasswordError(false);
                  setFormError(false);
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
                      <LockOutlined />
                      <Divider
                        sx={{ height: 30, m: "0 .75em" }}
                        orientation="vertical"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        sx={{
                          "& > svg": {
                            fontSize: "18px",
                            color: colors.primary[100],
                          },
                        }}
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
                <Typography color="error" variant="subtitle2" sx={{ mt: 1 }}>
                  {formError && formErrorMessage}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  "& > a": {
                    color: colors.primary[100],
                    textDecoration: "none",
                  },
                }}
              >
                <Link to="/forgot-password">Forgot Password?</Link>
              </Box>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  borderRadius: 4,
                  height: 45,
                  backgroundColor: colors.greenOnly[500],
                }}
              >
                <Typography variant="h5" sx={{ color: colors.whiteOnly[500] }}>
                  Login
                </Typography>
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
