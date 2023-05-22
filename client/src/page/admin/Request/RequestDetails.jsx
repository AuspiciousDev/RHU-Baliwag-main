import React, { useEffect, useState } from "react";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import DecisionDialogue from "../../../global/DecisionDialogue";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  useTheme,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
  AccessTime,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useRequestsContext } from "../../../hooks/useRequestContext";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_Icon from "../../../components/global/Paper_Icon";
import { format } from "date-fns-tz";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const RequestDetails = () => {
  const { reqID } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { requests, requestDispatch } = useRequestsContext();
  const { stocks, stockDispatch } = useInventoriesContext();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [prescriptionIMG_URL, setPrescriptionIMG_URL] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [actionBy, setActionBy] = useState("");
  const [status, setStatus] = useState("pending");
  const [releasingDate, setReleasingDate] = useState(null);
  const [maxQty, setMaxQty] = useState(0);

  let [items, setItems] = useState([]);
  const [medID, setMedID] = useState("");
  const [lotNum, setLotNum] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [lotNumError, setLotNumError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [page, setPage] = React.useState(15);
  const [medIDError, setMedIDError] = useState(false);
  const [releasingDateError, setReleasingDateError] = useState(false);

  const handleAddItem = async (e) => {
    if (!medID) return setMedIDError(true);
    if (!quantity) return setQuantityError(true);
    e.preventDefault();
    setItems;
    const value = {
      medID,
      lotNum,
      genericName,
      brandName,
      quantity,
    };

    let existingItem = items?.find((item) => {
      return item.medID === value.medID;
    });
    if (existingItem) {
      existingItem.medID = value.medID;
      existingItem.lotNum = value.lotNum;
      existingItem.genericName = value.genericName;
      existingItem.brandName = value.brandName;
      existingItem.quantity = value.quantity;
    } else {
      value && setItems((arr) => [...arr, value]);
    }
    clearItems();
  };

  const handleDate = (newValue) => {
    setReleasingDate(newValue);
    setReleasingDateError(false);
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

  const [decisionDialog, setDecisionDialog] = useState({
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
        const response = await axiosPrivate.get(`/api/request/search/${reqID}`);
        if (response.status === 200) {
          const json1 = await response.data[0];
          const json = await response.data[0].profile;
          setUsername(json?.username || "");
          setFirstName(json?.firstName || "");
          setMiddleName(json?.middleName || "");
          setLastName(json?.lastName || "");
          setPrescriptionIMG_URL(json1?.prescriptionIMG_URL || "");
          setEmail(json?.email || "");
          setMobile(json?.mobile || "");
          setAddress(json?.address || "");
          setCity(json?.city || "");
          setProvince(json?.province || "");
          setItems(json?.items || []);
          setCreatedAt(json?.createdAt || null);
          setStatus(json1?.status || "pending");
          setActionBy(json1?.actionBy || "-");
          setReleasingDate(json1?.releasingDate || null);
        }

        const apiStocks = await axiosPrivate.get("/api/inventory");
        console.log(
          "🚀 ~ file: RequestDetails.jsx:174 ~ getUsersDetails ~ apiStocks:",
          apiStocks
        );
        if (apiStocks.status === 200) {
          const json = await apiStocks.data;
          console.log(json);
          stockDispatch({ type: "SET_STOCKS", payload: json });
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
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
  }, [requestDispatch, stockDispatch, requests]);

  const toggleStatus = async ({ val, status }) => {
    console.log("🚀 ~ file: Request.jsx:288 ~ toggleStatus ~ val", val);
    setDecisionDialog({
      ...decisionDialog,
      isOpen: false,
    });

    const data = {
      username,
      reqID,
      transactor: auth.username,
      items,
      status,
      releasingDate,
      email,
    };
    console.log("🚀 ~ file: Request.jsx:329 ~ toggleStatus ~ data:", data);

    try {
      setLoadingDialog({ isOpen: true });
      if (status === "approved") {
        const apiTransact = await axiosPrivate.post(
          "/api/transaction/create",
          JSON.stringify(data)
        );
        if (apiTransact.status === 201) {
          const response = await axiosPrivate.patch(
            `/api/request/update/status/${reqID}`,
            JSON.stringify(data)
          );
          if (response.status === 200) {
            const response = await axiosPrivate.get("/api/request");
            if (response.status === 200) {
              const json = await response.data;
              requestDispatch({ type: "SET_REQUESTS", payload: json });
              setSuccessDialog({
                isOpen: true,
                message: `Request ${reqID} ${
                  status === "approved"
                    ? "has been approved!"
                    : "has been denied!"
                }`,
              });
            }
          }
        }
      } else {
        const apiTransact = await axiosPrivate.post(
          "/api/transaction/create",
          JSON.stringify(data)
        );
        if (apiTransact.status === 201) {
          const response = await axiosPrivate.patch(
            `/api/request/update/status/${val?.reqID}`,
            JSON.stringify({ status })
          );
          if (response.status === 200) {
            const response = await axiosPrivate.get("/api/request");
            if (response.status === 200) {
              const json = await response.data;
              console.log(json);
              requestDispatch({ type: "SET_REQUESTS", payload: json });
              setSuccessDialog({
                isOpen: true,
                message: `Request ${val.reqID} ${
                  status === "approved"
                    ? "has been approved!"
                    : "has been denied!"
                }`,
              });
            }
          }
        }
      }

      setLoadingDialog({ isOpen: false });
    } catch (error) {
      console.log("🚀 ~ file: User.jsx:169 ~ toggleStatus ~ error", error);
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
      } else if (error.response.status === 403) {
        setErrorDialog({
          isOpen: true,
          message: `${error.response.data.message}`,
        });
        navigate("/login", { state: { from: location }, replace: true });
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

  const handleUpdateItem = async () => {
    if (items.length === 0) {
      return setErrorDialog({
        isOpen: true,
        message: `No items added!`,
      });
    }
    if (releasingDate === null) {
      return (
        setReleasingDateError(true),
        setErrorDialog({
          isOpen: true,
          message: `Set releasing date!`,
        })
      );
    }
    setValidateDialog({
      isOpen: true,
      onConfirm: () => {
        setDecisionDialog({
          isOpen: true,
          title: `Approve request ${reqID}? `,
          onConfirm: () => {
            toggleStatus({
              val: status,
              status: "approved",
            });
          },
          onDeny: () => {
            toggleStatus({
              val: status,
              status: "denied",
            });
          },
        });
      },
    });

    const data = {
      reqID,
      items,
    };
    try {
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
  const clearItems = () => {
    setLotNum("");
    setMedID("");
    setGenericName("");
    setBrandName("");
    setQuantity("");
  };

  const handleRowClick = async (val) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure to remove ${val.medID}?`,
      onConfirm: () => {
        handleRemoveRow(val.medID);
      },
    });
  };
  const handleRemoveRow = async (value) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    let newItems = items.filter((val) => val.medID != value);
    setItems(newItems);
  };
  const clearTable = () => {
    clearItems();
    setItems([]);
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
      <DecisionDialogue
        decisionDialog={decisionDialog}
        setDecisionDialog={setDecisionDialog}
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
              Request &#62; details
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          p: 2,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: " 1fr 1fr",
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75em 0.5em",
              alignItems: "center",
              justifyContent: "center",
              "& >.MuiTypography-root ": {
                textTransform: "capitalize",
                fontSize: "14pt",
              },
            }}
          >
            <Typography textAlign="end">Request ID : </Typography>
            <Typography fontWeight={600}>{reqID || "-"}</Typography>
            <Typography textAlign="end">username : </Typography>
            <Typography fontWeight={600}>{username}</Typography>
            <Typography textAlign="end">Name : </Typography>
            <Typography fontWeight={600}>
              {middleName
                ? firstName + " " + middleName.charAt(0) + ". " + lastName
                : firstName + " " + lastName}
            </Typography>

            <Typography textAlign="end">Mobile : </Typography>
            <Typography fontWeight={600}>
              {mobile ? "09" + mobile : "-"}
            </Typography>
            <Typography textAlign="end">Email : </Typography>
            <Typography
              fontWeight={600}
              sx={{ textTransform: "lowercase !important" }}
            >
              {email || "-"}
            </Typography>
            <Typography textAlign="end">Prescription : </Typography>
            {prescriptionIMG_URL ? (
              <Link
                to={`/admin/request/prescription/${reqID}`}
                style={{ textDecoration: "none" }}
              >
                <Typography fontWeight={600}>Link</Typography>
              </Link>
            ) : (
              <Typography fontWeight={600}>
                {(prescriptionIMG_URL && "yes") || "none"}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75em 0.5em",
              alignItems: "center",
              justifyContent: "center",
              "& >.MuiTypography-root ": {
                textTransform: "capitalize",
                fontSize: "14pt",
              },
            }}
          >
            <Typography textAlign="end">Address : </Typography>
            <Typography fontWeight={600}>{address || "-"}</Typography>
            <Typography textAlign="end">City : </Typography>
            <Typography fontWeight={600}>{city || "-"}</Typography>
            <Typography textAlign="end">Province : </Typography>
            <Typography fontWeight={600}>{province || "-"}</Typography>
            <Typography textAlign="end">Action by : </Typography>
            <Typography fontWeight={600}>{actionBy || "-"}</Typography>
            <Typography textAlign="end">Request Date : </Typography>{" "}
            <Typography fontWeight={600}>
              {createdAt && format(new Date(createdAt), "MMMM dd, yyyy")}
            </Typography>
            <Typography textAlign="end">Release Date : </Typography>
            {releasingDate === null || status === "pending" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date of Release"
                  inputFormat="MM/DD/YYYY"
                  value={releasingDate}
                  onChange={handleDate}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      size="small"
                      disabled
                      {...params}
                      error={releasingDateError}
                    />
                  )}
                />
              </LocalizationProvider>
            ) : (
              <Typography fontWeight={600}>
                {releasingDate &&
                  format(new Date(releasingDate), "MMMM dd, yyyy")}
              </Typography>
            )}
            <Typography textAlign="end">Status : </Typography>
            <Box>
              <ButtonBase
                disabled
                onClick={() => {
                  setValidateDialog({
                    isOpen: true,
                    onConfirm: () => {
                      setDecisionDialog({
                        isOpen: true,
                        title: `Approve request ${reqID}? `,
                        onConfirm: () => {
                          toggleStatus({
                            val: status,
                            status: "approved",
                          });
                        },
                        onDeny: () => {
                          toggleStatus({
                            val: status,
                            status: "denied",
                          });
                        },
                      });
                    },
                  });
                }}
              >
                {status === "approved" ? (
                  <Paper_Status icon={<CheckCircle />} title={"Approved"} />
                ) : status === "denied" ? (
                  <Paper_Status icon={<Cancel />} title={"Denied"} />
                ) : (
                  <Paper_Status icon={<AccessTime />} title={"pending"} />
                )}
              </ButtonBase>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: "1em 0" }} />
        {status === "pending" ? (
          <Box>
            <Typography variant="h5" sx={{ margin: "0 0 10px 0" }}>
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
                    ? stocks.map((val) => {
                        return val?.lotNum;
                      })
                    : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Lot Number"
                    required
                    error={lotNumError}
                  />
                )}
                value={lotNum}
                onChange={(event, newValue) => {
                  setLotNum(newValue);
                  setLotNumError(false);
                  stocks
                    .filter((filter) => {
                      return filter?.lotNum === newValue;
                    })
                    .map((val) => {
                      return (
                        setMedID(val?.medID),
                        setGenericName(val?.genericName),
                        setBrandName(val?.brandName),
                        setMaxQty(val?.quantity)
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
                required
                size="small"
                type="number"
                autoComplete="off"
                variant="outlined"
                label="Quantity"
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(
                    0,
                    Math.min(maxQty, Number(e.target.value))
                  );
                  setQuantity(value);
                  // setTaskPoints(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="subtitle2"
                        sx={{ color: colors.black[400] }}
                      >
                        {quantity} / {maxQty}
                      </Typography>
                    </InputAdornment>
                  ),
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
                  sx={{ width: "250px", height: "50px" }}
                  onClick={() => {
                    clearItems();
                  }}
                >
                  <Typography variant="h5">clear</Typography>
                </Button>
                <Button
                  disabled={!quantity || !lotNum || !medID}
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleAddItem}
                  sx={{ width: "250px", height: "50px" }}
                >
                  <Typography variant="h5" sx={{ color: "white" }}>
                    add Item
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h3"
                textTransform="uppercase"
                sx={{ margin: "15px 0 10px 0" }}
              >
                Item Details
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
                        <TableCell>Medicine ID</TableCell>
                        <TableCell align="left">Lot Number</TableCell>
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
                              <TableCell>{val?.medID}</TableCell>
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
                      height: "35px",
                    },
                  }}
                >
                  <Button
                    type="button"
                    size="small"
                    variant="contained"
                    sx={{ width: "250px", height: "50px" }}
                    onClick={() => {
                      clearItems();
                    }}
                  >
                    <Typography variant="h5">clear</Typography>
                  </Button>
                  <Button
                    size="small"
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={handleUpdateItem}
                    sx={{ width: "250px", height: "50px" }}
                  >
                    <Typography variant="h5" sx={{ color: "white" }}>
                      Approve
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Paper>
    </Box>
  );
};

export default RequestDetails;
