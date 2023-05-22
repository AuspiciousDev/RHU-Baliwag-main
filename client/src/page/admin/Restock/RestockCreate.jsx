import React, { useEffect, useState } from "react";

import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { format } from "date-fns-tz";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {
  Box,
  useTheme,
  Paper,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { tokens } from "../../../theme";
import useAuth from "../../../hooks/useAuth";
import { axiosPrivate } from "../../../api/axios";
const RestockCreate = () => {
  const isNumber = (str) => /^[0-9]*$/.test(str);
  const { auth } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { stocks, stockDispatch } = useInventoriesContext();

  const [medID, setMedID] = useState("");
  const [lotNum, setLotNum] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [medIDError, setMedIDError] = useState(false);
  const [lotNumError, setLotNumError] = useState(false);
  const [deliveryDateError, setDeliveryDateError] = useState(false);

  const handleDate = (newValue) => {
    let CurrentDate = new Date();
    let newDate = new Date(newValue);
    if (newDate > CurrentDate) {
      setDeliveryDateError(true);
    } else {
      setDeliveryDate(newValue);
      setDeliveryDateError(false);
    }
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

  const clearFields = () => {
    setMedID("");
    setLotNum("");
    setGenericName("");
    setBrandName("");
    setQuantity("");
    setSupplier("");
    setDeliveryDate(null);
  };
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
    e.preventDefault();
    setLoadingDialog({ isOpen: true });
    const doc = {
      medID,
      lotNum,
      quantity,
      restockedBy: auth.username,
      supplier,
      deliveryDate,
    };

    try {
      const response = await axiosPrivate.post(
        "/api/restock/create",
        JSON.stringify(doc)
      );

      if (response.status === 201) {
        const json = await response.data;
        console.log("response;", json);
        setSuccessDialog({
          isOpen: true,
          message: `Item ${medID + " - " + genericName} has been restocked!`,
        });
        clearFields();
      }
      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: RestockCreate.jsx:170 ~ handleSubmit ~ error",
        error
      );

      setLoadingDialog({ isOpen: false });
      const errMessage = error.response.data.message;
      if (!error?.response) {
        console.log("no server response");
      } else if (error.response.status === 400) {
        console.log(errMessage);
      } else if (error.response.status === 409) {
        setLotNumError(true);
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
              Restock &#62; Create
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: "20px", mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* <Typography variant="h5">Registration</Typography> */}
          <Box marginBottom="20px">
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
              Restock Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr " },
                gap: "20px",
              }}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={
                  stocks
                    ? stocks.map((val) => {
                        return val?.medID;
                      })
                    : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medicine ID"
                    required
                    error={medIDError}
                  />
                )}
                value={medID}
                onChange={(event, newValue) => {
                  setMedID(newValue);
                  setMedIDError(false);
                  stocks
                    .filter((filter) => {
                      return filter.medID === newValue;
                    })
                    .map((val) => {
                      return (
                        setGenericName(val?.genericName),
                        setBrandName(val?.brandName),
                        setSupplier(val?.supplier)
                      );
                    });
                }}
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
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
              <Box></Box>
              <TextField
                required
                autoComplete="off"
                variant="outlined"
                label="Generic Name"
                placeholder="eg. Paracetamol, Ibuprofen"
                value={genericName}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <TextField
                autoComplete="off"
                variant="outlined"
                label="Brand Name"
                placeholder="eg. Biogesic, Medicol, Solmux"
                value={brandName}
                inputProps={{ style: { textTransform: "capitalize" } }}
              />

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
              />
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
                inputProps={{ style: { textTransform: "capitalize" } }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Delivery Date"
                  inputFormat="MM/DD/YYYY"
                  value={deliveryDate}
                  onChange={handleDate}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      required
                      disabled
                      {...params}
                      error={deliveryDateError}
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
              disabled={medIDError || deliveryDateError}
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

export default RestockCreate;
