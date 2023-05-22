import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
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
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { useUsersContext } from "../../../hooks/useUserContext";
const RequestCreate = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { stocks, stockDispatch } = useInventoriesContext();
  const { users, userDispatch } = useUsersContext();

  const [username, setUsername] = useState("");
  const [requestType, setRequestType] = useState("walkin");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const [lotNum, setLotNum] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [quantityError, setQuantityError] = useState("");

  let [items, setItems] = useState([]);

  const [lotNumError, setLotNumError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
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
  const [validateDialog, setValidateDialog] = useState({
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
        const response = await axiosPrivate.get("/api/inventory");
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          stockDispatch({ type: "SET_STOCKS", payload: json });
        }

        const apiUsers = await axiosPrivate.get("/api/user");
        if (apiUsers.status === 200) {
          const json = await apiUsers.data;
          console.log(json);
          userDispatch({ type: "SET_USERS", payload: json });
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log("🚀 ~ file: User.jsx:90 ~ getUsersDetails ~ error", error);
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
  }, [stockDispatch]);

  const handleSubmit = async (e) => {
    setLoadingDialog({ isOpen: true });
    e.preventDefault();
    const data = {
      username,
      requestType,
    };
    console.log(
      "🚀 ~ file: RequestCreate.jsx:157 ~ handleSubmit ~ data:",
      data
    );

    try {
      const response = await axiosPrivate.post(
        "/api/request/create",
        JSON.stringify(data)
      );
      if (response?.status === 201) {
        setSuccessDialog({
          isOpen: true,
          message: `Request ${response.data._id} has been created!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      console.log(error);
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
      } else if (error.response.status === 409) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        setDepIDError(true);
        setLevelIDerror(true);
        setSectionIDerror(true);
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

  const clearFields = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setAddress("");
    setCity("");
    setProvince("");
    setEmail("");
    setMobile("");
  };

  return (
    <Box className="container-layout_body_contents">
      <ConfirmDialogue
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SuccessDialogue
        successDialog={successDialog}
        setSuccessDialog={setSuccessDialog}
      />
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <ValidateDialogue
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
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
              {/* Request &#62; Create */}
             Create Walk-in Request
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ height: "100%", p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
            Personal Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr 1fr " },
              gap: "20px",
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={
                users
                  ? users
                      .filter((filter) => {
                        return filter.userType === "user";
                      })
                      .map((val) => {
                        return val?.username;
                      })
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient ID"
                  required
                  error={usernameError}
                />
              )}
              value={username}
              onChange={(event, newValue) => {
                setUsername(newValue);
                setUsernameError(false);
                users
                  .filter((filter) => {
                    return filter.username === newValue;
                  })
                  .map((val) => {
                    return (
                      setFirstName(val?.firstName),
                      setMiddleName(val?.middleName),
                      setLastName(val?.lastName),
                      setAddress(val?.address || "-"),
                      setCity(val?.city || "-"),
                      setProvince(val?.province || "-"),
                      setEmail(val?.email || "-"),
                      setMobile(val?.mobile || "-")
                    );
                  });
              }}
            />
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <TextField
              required
              autoComplete="off"
              variant="outlined"
              label="First Name"
              placeholder="Given Name"
              value={firstName}
              // onChange={(e) => {
              //   if (e.target.value.trim().length === 0) {
              //     setFirstName("");
              //   } else {
              //     if (isLetters(e.target.value)) {
              //       setFirstName(e.target.value);
              //     }
              //   }
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              autoComplete="off"
              variant="outlined"
              label="Middle Name"
              placeholder="Optional"
              value={middleName}
              // onChange={(e) => {
              //   if (e.target.value.trim().length === 0) {
              //     setMiddleName("");
              //   } else {
              //     if (isLetters(e.target.value)) {
              //       setMiddleName(e.target.value);
              //     }
              //   }
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              required
              autoComplete="off"
              variant="outlined"
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              // onChange={(e) => {
              //   if (e.target.value.trim().length === 0) {
              //     setLastName("");
              //   } else {
              //     if (isLetters(e.target.value)) {
              //       setLastName(e.target.value);
              //     }
              //   }
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />{" "}
            <Box></Box>
            <TextField
              required
              autoComplete="off"
              variant="outlined"
              label="Address"
              placeholder="House number, block no., street name, zone ..."
              value={address}
              // onChange={(e) => {
              //   setAddress(e.target.value);
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              required
              autoComplete="off"
              variant="outlined"
              label="City"
              placeholder="City/Municipality"
              value={city}
              // onChange={(e) => {
              //   if (isLetters(e.target.value)) {
              //     setCity(e.target.value);
              //   }
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              required
              autoComplete="off"
              variant="outlined"
              label="Province"
              placeholder="Bulacan, Pamgpanga, Metro Manila"
              value={province}
              // onChange={(e) => {
              //   if (isLetters(e.target.value)) {
              //     setProvince(e.target.value);
              //   }
              // }}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />{" "}
            <Box></Box>
            <TextField
              required
              type="email"
              autoComplete="off"
              variant="outlined"
              label="Email"
              placeholder="Active and valid email address"
              value={email}
              // onChange={(e) => {
              //   setEmail(e.target.value);
              // }}
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
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "row",
              gap: 2,
              gridColumn: "2",
              justifyContent: "end",
              "& > .MuiButtonBase-root": {
                width: "200px",
                height: "50px",
              },
            }}
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

export default RequestCreate;
