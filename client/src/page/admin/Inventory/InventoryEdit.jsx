import React, { useEffect, useState } from "react";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import {
  Box,
  useTheme,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { axiosPrivate } from "../../../api/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
const InventoryEdit = () => {
  const { medID } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { stocks, stockDispatch } = useInventoriesContext();

  const [lotNum, setLotNum] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [access, setAccess] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [manufactureDate, setManufactureDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);

  const [medIDError, setMedIDError] = useState(false);
  const [lotNumError, setLotNumError] = useState(false);
  const [manufactureDateError, setManufactureDateError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);

  const handleManufactureDate = (newValue) => {
    setManufactureDate(newValue);
    setManufactureDateError(false);
  };
  const handleExpiryDate = (newValue) => {
    setExpiryDate(newValue);
    setExpiryDateError(false);
  };

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
        const response = await axiosPrivate.get(
          `/api/inventory/search/${medID}`
        );
        if (response.status === 200) {
          const json = await response.data;
          console.log(
            "🚀 ~ file: InventoryEdit.jsx:88 ~ getUsersDetails ~ json:",
            json
          );

          setLotNum(json?.lotNum || "");
          setGenericName(json?.genericName || "");
          setBrandName(json?.brandName || "");
          setAccess(json?.access || "");
          setQuantity(json?.quantity || "");
          setSupplier(json?.supplier || "");
          setManufactureDate(json?.manufactureDate || "");
          setExpiryDate(json?.expiryDate || "");
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
  }, [stockDispatch]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const doc = {
      medID,
      lotNum,
      genericName,
      brandName,
      access,
      quantity,
      supplier,
      manufactureDate,
      expiryDate,
    };

    try {
      const response = await axiosPrivate.patch(
        `/api/inventory/update/${medID}`,
        JSON.stringify(doc)
      );

      if (response.status === 200) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `Stock ${medID + " - " + genericName} has been updated!!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 409) {
        setMedIDError(true);
        console.log(errMessage);
      } else {
        console.log(error);
        console.log(error.response);
      }
    }
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
              Stock &#62; Edit &#62; {medID}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          <Box marginBottom="20px">
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Stock Information
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
                label="Medicine ID"
                value={medID}
                security
                placeholder="Medicine ID"
              />
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Lot Number"
                value={lotNum}
                placeholder="Medicine Lot Number"
                onChange={(e) => {
                  setLotNum(e.target.value);
                  setLotNumError(false);
                }}
                error={lotNumError}
                helperText={lotNumError && "Stock ID already exists!"}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Generic Name"
                placeholder="eg. Paracetamol, Ibuprofen"
                value={genericName}
                onChange={(e) => {
                  setGenericName(e.target.value);
                }}
              />
              <TextField
                autoComplete="off"
                variant="outlined"
                label="Brand Name"
                placeholder="eg. Biogesic, Medicol, Solmux"
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                }}
              />
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">Access</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={access}
                  label="Access"
                  onChange={(e) => {
                    setAccess(e.target.value);
                  }}
                >
                  <MenuItem value={"regular"}>Regular</MenuItem>
                  <MenuItem value={"restricted"}>Restricted</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                type="number"
                autoComplete="off"
                variant="outlined"
                label="Quantity"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />{" "}
              <TextField
                required
                type="text"
                autoComplete="off"
                variant="outlined"
                label="Supplier"
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Manufactured Date"
                  inputFormat="MM/DD/YYYY"
                  value={manufactureDate}
                  onChange={handleManufactureDate}
                  renderInput={(params) => (
                    <TextField
                      required
                      disabled
                      {...params}
                      autoComplete="off"
                      error={manufactureDateError}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Expiration Date"
                  inputFormat="MM/DD/YYYY"
                  value={expiryDate}
                  onChange={handleExpiryDate}
                  renderInput={(params) => (
                    <TextField
                      required
                      disabled
                      {...params}
                      autoComplete="off"
                      error={expiryDateError}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          <Box
            display="flex"
            sx={{ justifyContent: { xs: "center", sm: "end" } }}
            height="70px"
            gap={2}
          >
            <Button
              type="submit"
              disabled={lotNumError}
              variant="contained"
              color="secondary"
              sx={{ width: "250px", height: "50px" }}
            >
              <Typography variant="h5" sx={{ color: "white" }}>
                Update
              </Typography>
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default InventoryEdit;
