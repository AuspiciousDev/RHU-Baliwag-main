import { useState } from "react";
import {
  Avatar,
  ButtonBase,
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
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import { useEffect } from "react";

import { storage } from "../../public/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { ModeEditOutline } from "@mui/icons-material";
const AdminRecordEdit = () => {
  const { username } = useParams();
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { users, userDispatch } = useUsersContext();

  const [imgURL, setImgURL] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [telephone, setTelephone] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const handleDate = (newValue) => {
    setDateOfBirth(newValue);
    setDateOfBirthError(false);
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
  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/user/search/${username}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log(
            "🚀 ~ file: UserRecordEdit.jsx:95 ~ getUsersDetails ~ json",
            json
          );
          setImgURL(json?.imgURL || "");
          setUserType(json?.userType || "");
          setFirstName(json?.firstName || "");
          setMiddleName(json?.middleName || "");
          setLastName(json?.lastName || "");
          setDateOfBirth(json?.dateOfBirth || null);
          setGender(json?.gender || "");
          setAddress(json?.address || "");
          setCity(json?.city || "");
          setProvince(json?.province || "");
          setEmail(json?.email || "");
          setMobile(json?.mobile || "");
          setTelephone(json?.telephone || "");
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: UserRecordEdit.jsx:122 ~ getUsersDetails ~ error",
          error
        );
        setLoadingDialog({ isOpen: false });

        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else if (error.response.status === 500) {
          setErrorDialog({
            isOpen: true,
            message: `${error.response.data.message}`,
          });
          console.log(error.response.data.message);
        } else {
          setErrorDialog({
            isOpen: true,
            message: `${error}`,
          });
          console.log(error);
        }
      }
    };
    getUsersDetails();
  }, [userDispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const user = {
      username,
      userType,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      address,
      city,
      province,
      email,
      mobile,
      telephone,
    };
    try {
      const response = await axiosPrivate.patch(
        `/api/user/update/${username}`,
        JSON.stringify(user)
      );

      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `User ${username} has been updated!`,
        });
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: UserRecordEdit.jsx:207 ~ handleSubmit ~ error",
        error
      );

      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
        console.log();
      } else if (error.response.status === 409) {
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
  };
  const [imageUpload, setImageUpload] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [changeIMG, setChangeIMG] = useState(false);

  const uploadImage = async () => {
    setLoadingDialog({
      isOpen: true,
    });

    if (imageUpload == null) {
      return (
        setLoadingDialog({
          isOpen: false,
        }),
        setErrorDialog({
          isOpen: true,
          message: `Please choose an image.`,
        })
      );
    }
    try {
      const imageRef = ref(storage, `ADP/users/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          console.log("Download link to your file: ", downloadURL);
          await imageToDB(downloadURL);
          await setImageUpload(null);
        });
      });
      setLoadingDialog({
        isOpen: false,
      });
    } catch (error) {
      console.log("🚀 ~ file: Profile.jsx:106 ~ uploadImage ~ error", error);
      setLoadingDialog({
        isOpen: false,
      });
      setErrorDialog({
        isOpen: true,
        message: `${error}`,
      });
    }
  };
  const imageToDB = async (downloadURL) => {
    setLoadingDialog({
      isOpen: true,
    });
    const object = {
      username: username,
      imgURL: downloadURL,
    };
    console.log(object);
    try {
      const response = await axiosPrivate.patch(
        `/api/user/update/img/${username}`,
        JSON.stringify(object)
      );
      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: "Image Profile has been updated!",
        });
      }
      setChangeIMG((e) => !e);
      setLoadingDialog({
        isOpen: false,
      });
    } catch (error) {
      setLoadingDialog({
        isOpen: false,
      });
      if (!error.response) {
        console.log("no server response");
      } else if (error.response.status === 204) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate(-1);
        console.log(error.response.data.message);
      } else if (error.response.status === 400) {
        console.log(error.response.data.message);
      } else {
        setErrorDialog({
          isOpen: true,
          message: `${error}`,
        });
        console.log(error);
      }
    }
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
              Admin &#62; EDIT &#62; {username}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          m: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Paper
          sx={{
            width: "150px",
            height: "150px",
            maxHeight: "250px",
            maxWidth: "250px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "125px",
            p: 1,
          }}
        >
          <Avatar
            alt="profile-user"
            sx={{ width: "100%", height: "100%" }}
            src={imgFile ? imgFile : imgURL}
            style={{
              objectFit: "contain",
            }}
          />

          <Paper
            sx={{
              bottom: 0,
              right: 0,
              display: "flex",
              width: "30px",
              height: "30px",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "25px",
            }}
          >
            <ButtonBase
              onClick={() => {
                setChangeIMG((e) => !e);
              }}
            >
              <ModeEditOutline />
            </ButtonBase>
          </Paper>
        </Paper>
        {changeIMG && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              accept="image/*"
              id="profilePhoto"
              type="file"
              className="hidden"
              onChange={(e) => {
                setImageUpload(e.target.files[0]);
                setImgFile(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <Button
              variant="contained"
              type="button"
              size="small"
              onClick={uploadImage}
            >
              Upload
            </Button>
          </Box>
        )}
      </Box>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          {/* // ! Personal Information */}
          <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
            User Information
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
              size="small"
              required
              disabled
              autoComplete="off"
              variant="outlined"
              label="Employee ID"
              placeholder="10 Digit Employee ID"
              value={username}
            />
          </Box>
          {/* // ! Personal Information */}
          <Typography variant="h5" sx={{ margin: "15px 0 10px 0" }}>
            Personal Information
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
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="First Name"
              placeholder="Given Name"
              error={firstNameError}
              value={firstName}
              onChange={(e) => {
                if (isLetters(e.target.value)) {
                  setFirstName(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Middle Name"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => {
                setMiddleName(e.target.value);
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              size="small"
              required
              autoComplete="off"
              variant="outlined"
              label="Last Name"
              placeholder="Last Name"
              error={lastNameError}
              value={lastName}
              onChange={(e) => {
                if (isLetters(e.target.value)) {
                  setLastName(e.target.value);
                }
              }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
              gap: "20px",
              marginTop: "20px",
              mb: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date of Birth"
                inputFormat="MM/DD/YYYY"
                error={dateOfBirthError}
                value={dateOfBirth}
                onChange={handleDate}
                renderInput={(params) => (
                  <TextField size="small" required disabled {...params} />
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

            <TextField
              size="small"
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
              size="small"
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
              size="small"
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
            <TextField
              size="small"
              required
              type="email"
              autoComplete="off"
              variant="outlined"
              label="Email"
              placeholder="Active and valid email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
            <TextField
              size="small"
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

          {/* //! button */}
          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" } }}
            height="70px"
            gap={2}
          >
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                update
              </Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminRecordEdit;
