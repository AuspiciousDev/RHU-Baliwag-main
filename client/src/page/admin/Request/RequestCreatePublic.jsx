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
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import axios from "../../../api/axios";

import Navbar from "../../public/components/Navbar";
const RequestCreatePublic = () => {
  const isLetters = (str) => /^[A-Za-z\s]*$/.test(str);
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { stocks, stockDispatch } = useInventoriesContext();

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

        const response = await axios.get("/api/public/inventory", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          const json = await response.data;
          console.log(json);
          stockDispatch({ type: "SET_STOCKS", payload: json });
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
      firstName,
      middleName,
      lastName,
      address,
      city,
      province,
      email,
      mobile,
      items,
    };

    try {
      const response = await axios.post(
        "/api/public/request/create",
        JSON.stringify(data)
      );
      if (response?.status === 201) {
        setSuccessDialog({
          isOpen: true,
          message: `Request ${response.data._id} has been created!`,
        });
        clearScheduleFields();
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

  const handleAddItem = async (e) => {
    if (!lotNum) return setLotNumError(true);
    if (!quantity) return setQuantityError(true);
    e.preventDefault();
    setItems;
    const value = {
      lotNum,
      genericName,
      brandName,
      quantity,
    };

    let existingItem = items?.find((item) => {
      return item.lotNum === value.lotNum;
    });
    if (existingItem) {
      existingItem.lotNum = value.lotNum;
      existingItem.genericName = value.genericName;
      existingItem.brandName = value.brandName;
      existingItem.quantity = value.quantity;
    } else {
      value && setItems((arr) => [...arr, value]);
    }
    clearItems();
  };
  const clearItems = () => {
    setLotNum("");
    setGenericName("");
    setBrandName("");
    setQuantity("");
  };
  const clearScheduleFields = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setAddress("");
    setCity("");
    setProvince("");
    setEmail("");
    setMobile("");
    clearItems();
    setItems([]);
  };
  const handleRowClick = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.lotNum}?`,
      onConfirm: () => {
        handleRemoveRow(val.lotNum);
      },
    });
  };
  const handleRemoveRow = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = items.filter((val) => val.lotNum != value);
    setItems(newItems);
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
      <Navbar />
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
              Public Request
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
            <TextField
              required
              size="small"
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
              size="small"
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
              size="small"
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
          </Box>

          <Typography variant="h5" sx={{ margin: "15px 0 10px 0" }}>
            Item Information
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
                stocks
                  ? stocks
                      .filter((filter) => {
                        return filter.status === true;
                      })
                      .map((val) => {
                        return val?.lotNum;
                      })
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Lot Number"
                  error={lotNumError}
                />
              )}
              value={lotNum}
              onChange={(event, newValue) => {
                console.log(newValue);
                setLotNum(newValue);
                setLotNumError(false);
                setQuantityError(false);
                stocks
                  .filter((filter) => {
                    return filter.lotNum === newValue;
                  })
                  .map((val) => {
                    return (
                      setGenericName(val?.genericName),
                      setBrandName(val?.brandName)
                    );
                  });
              }}
            />

            <TextField
              size="small"
              autoComplete="off"
              variant="outlined"
              label="Generic Name"
              placeholder="eg. Paracetamol, Ibuprofen"
              value={genericName}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />
            <TextField
              autoComplete="off"
              size="small"
              variant="outlined"
              label="Brand Name"
              placeholder="eg. Biogesic, Medicol, Solmux"
              value={brandName}
              inputProps={{ style: { textTransform: "capitalize" } }}
            />

            <TextField
              size="small"
              type="number"
              autoComplete="off"
              variant="outlined"
              label="Quantity"
              value={quantity}
              error={quantityError}
              onChange={(e) => {
                setQuantity(e.target.value);
                setQuantityError(false);
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                gridColumn: "4",
                justifyContent: "end",
                "& > .MuiButtonBase-root": {
                  width: "200px",
                  height: "35px",
                },
              }}
            >
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleAddItem}
                sx={{ width: "250px", height: "50px" }}
              >
                <Typography variant="h5">add Item</Typography>
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ width: "250px", height: "50px" }}
                onClick={() => {
                  clearItems();
                }}
              >
                <Typography variant="h5">clear</Typography>
              </Button>
            </Box>
          </Box>
          <Typography variant="h5" sx={{ margin: "15px 0 10px 0" }}>
            Item Table
          </Typography>
          <Box
            sx={{
              borderTop: `solid 1px ${colors.primary[500]}`,
              mt: 2,
              height: "200px",
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: "100%" }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Lot Number</TableCell>
                    <TableCell align="left">Generic Name</TableCell>
                    <TableCell align="left">Brand Name</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items &&
                    items.map((val, key) => {
                      return (
                        <TableRow
                          sx={{
                            "& > td ": {
                              textTransform: "capitalize",
                            },
                          }}
                        >
                          <TableCell>{val?.lotNum}</TableCell>
                          <TableCell>{val?.genericName}</TableCell>
                          <TableCell>{val?.brandName}</TableCell>
                          <TableCell>{val?.quantity}</TableCell>
                          <TableCell>
                            <ButtonBase
                              onClick={() => {
                                handleRowClick(val);
                              }}
                            >
                              <Paper
                                sx={{
                                  padding: "2px 10px",
                                  borderRadius: "20px",
                                  display: "flex",
                                  justifyContent: "center",
                                  backgroundColor: colors.whiteOnly[500],
                                  color: colors.blackOnly[500],
                                  alignItems: "center",
                                }}
                              >
                                <Delete />
                                <Typography ml="5px">Remove</Typography>
                              </Paper>
                            </ButtonBase>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            sx={{
              mt: 3,
              display: items.length > 0 ? "flex" : "none",
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
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5">submit</Typography>
            </Button>
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
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RequestCreatePublic;
