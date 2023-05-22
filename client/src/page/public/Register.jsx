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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";

import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "../../api/axios";

import ErrorDialogue from "../../global/ErrorDialogue";
import SuccessDialogue from "../../global/SuccessDialogue";
import LoadingDialogue from "../../global/LoadingDialogue";
import Navbar from "./components/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const Register = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [empID, setEmpID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [userType, setUserType] = useState("user");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);
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

  const handleDate = (newValue) => {
    // if (getAge(newValue) >= 18) {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
    // } else {
    //   setDateOfBirth(newValue);
    //   setDateOfBirthError(true);
    // }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const doc = {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      mobile,
      gender,
      userType,
      address,
      city,
      province,
    };

    try {
      const response = await axios.post(
        "/api/auth/register",
        JSON.stringify(doc)
      );

      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `A verification token has been sent to ${doc.email} email!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: UserCreate.jsx:105z ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      if (!error?.response) {
        setErrorDialog({
          isOpen: true,
          message: ` ${error.message}`,
        });
      }
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 409) {
        setEmailError(true);
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };
  const clearFields = () => {
    setEmail("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setUserType("");
    setDateOfBirth(null);
    setGender("");
    setMobile("");
    setAddress("");
    setCity("");
    setProvince("");
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
          sx={{ width: "50%", borderRadius: 5, justifyContent: "center" }}
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
            <Box
              className="container-column"
              sx={{ width: "150%", gap: 2.5, mt: 1 }}
            >
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
                Register
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr ",
                  gap: 2,
                }}
              >
                <TextField
                  required
                  fullWidth
                  type="email"
                  size="small"
                  label="Email"
                  name="password"
                  variant="outlined"
                  className="register-input"
                  autoComplete="off"
                  value={email}
                  error={emailError}
                  onChange={(e) => {
                    setEmailError(false);
                    setEmail(e.target.value);
                  }}
                  helperText={emailError ? "Email already registered!" : ""}
                />
                <TextField
                  required
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                  label="Mobile Number"
                  value={mobile}
                  placeholder="9 Digit Mobile Number"
                  inputProps={{ maxLength: 9 }}
                  onChange={(e) => {
                    if (isNumber(e.target.value) || "") {
                      setMobile(e.target.value);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <>
                        <Typography>09</Typography>
                        <Divider
                          sx={{ height: 28, m: 0.5 }}
                          orientation="vertical"
                        />
                      </>
                    ),
                  }}
                />
                <Box></Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="First name"
                  variant="outlined"
                  autoComplete="off"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Middle name"
                  variant="outlined"
                  autoComplete="off"
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value);
                  }}
                />

                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Last name"
                  variant="outlined"
                  autoComplete="off"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Date of Birth"
                    inputFormat="MM/DD/YYYY"
                    value={dateOfBirth}
                    onChange={handleDate}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        required
                        disabled
                        {...params}
                        error={dateOfBirthError}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControl required fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    label="Gender"
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </Select>
                </FormControl>
                <Box></Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Address"
                  variant="outlined"
                  autoComplete="off"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="City"
                  variant="outlined"
                  autoComplete="off"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Province"
                  variant="outlined"
                  autoComplete="off"
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                  }}
                />
              </Box>
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
                <Link to="/login">Login instead?</Link>
              </Box>
              <Button
                disabled={emailError}
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
                  Sign up
                </Typography>
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
