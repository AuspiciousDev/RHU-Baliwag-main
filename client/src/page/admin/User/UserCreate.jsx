import { useState } from "react";
import {
  Box,
  useTheme,
  Paper,
  Divider,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { tokens } from "../../../theme";
import { useUsersContext } from "../../../hooks/useUserContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
const UserCreate = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { users, userDispatch } = useUsersContext();

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

  const handleDate = (newValue) => {
    // if (getAge(newValue) >= 18) {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
    // } else {
    //   setDateOfBirth(newValue);
    //   setDateOfBirthError(true);
    // }
  };
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
    const doc = {
      username: empID,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      gender,
      userType,
      address,
      city,
      province,
      mobile,
      telephone,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/user/quick-create",
        JSON.stringify(doc)
      );

      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `Account for Mr/Ms. ${lastName} ${doc.email} has been created!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: UserCreate.jsx:105 ~ handleSubmit ~ error",
        error
      );
      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      console.log(
        "🚀 ~ file: UserCreate.jsx:127 ~ handleSubmit ~ errMessage:",
        errMessage
      );
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 409) {
        if (errMessage.includes("Username")) setUsernameError(true);
        if (errMessage.includes("Email")) setEmailError(true);

        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };
  const clearFields = () => {
    setEmpID("");
    setEmail("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setDateOfBirth(null);
    setGender("");
    setMobile("");
    setTelephone("");
    setAddress("");
    setCity("");
    setProvince("");
  };
  return (
    <Box className="container-layout_body_contents">
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
              PATIENT &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
            Patient Information
          </Typography>
          <Box sx={{ mb: "20px" }}>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
              }}
            >
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="First Name"
                placeholder="Given Name"
                value={firstName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setFirstName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setFirstName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                autoComplete="off"
                variant="outlined"
                label="Middle Name"
                placeholder="Optional"
                value={middleName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setMiddleName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setMiddleName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  if (e.target.value.trim().length === 0) {
                    setLastName("");
                  } else {
                    if (isLetters(e.target.value)) {
                      setLastName(e.target.value);
                    }
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Date of Birth"
                    inputFormat="MM/DD/YYYY"
                    value={dateOfBirth}
                    onChange={handleDate}
                    renderInput={(params) => (
                      <TextField
                        required
                        disabled
                        {...params}
                        error={dateOfBirthError}
                        helperText={dateOfBirthError ? "Invalid Age" : ""}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    error={genderError}
                    label="Gender"
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mb: "20px" }}>
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Contact Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
              }}
            >
              <TextField
                required
                type="email"
                autoComplete="off"
                variant="outlined"
                label="Email"
                placeholder="Active and valid email address"
                value={email}
                error={emailError}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                helperText={emailError ? "Email already registered!" : ""}
              />
              <TextField
                required
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
              <TextField
                autoComplete="off"
                variant="outlined"
                label="Telephone Number"
                value={telephone}
                placeholder="10 Digit Telephone Number"
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (isNumber(e.target.value) || "") {
                    setTelephone(e.target.value);
                  }
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: "40px" }}>
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Address Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
              }}
            >
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Address"
                placeholder="House number, block no., street name, zone ..."
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="City"
                placeholder="City/Municipality"
                value={city}
                onChange={(e) => {
                  if (isLetters(e.target.value)) {
                    setCity(e.target.value);
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Province"
                placeholder="Bulacan, Pamgpanga, Metro Manila"
                value={province}
                onChange={(e) => {
                  if (isLetters(e.target.value)) {
                    setProvince(e.target.value);
                  }
                }}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" } }}
            height="70px"
            gap={2}
          >
            <Button
              type="button"
              variant="contained"
              sx={{ width: "250px", height: "50px" }}
              onClick={() => {
                clearFields();
              }}
            >
              <Typography variant="h5">clear</Typography>
            </Button>
            <Button
              type="submit"
              disabled={emailError || dateOfBirthError}
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                submit
              </Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserCreate;
