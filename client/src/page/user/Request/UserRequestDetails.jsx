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
      genericName,
      brandName,
      quantity,
    };

    let existingItem = items?.find((item) => {
      return item.medID === value.medID;
    });
    if (existingItem) {
      existingItem.medID = value.medID;
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          height: "100%",
          gap: "0.75em 0.5em",
          "& >.MuiTypography-root ": {
            textTransform: "capitalize",
            fontSize: "12pt",
          },
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            mt: 2,
            p: 5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
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
              <Typography fontWeight={600} textTransform="uppercase">
                {(prescriptionIMG_URL && "yes") || "none"}
              </Typography>
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
              <Typography fontWeight={600}>
                {releasingDate &&
                  format(new Date(releasingDate), "MMMM dd, yyyy")}
              </Typography>
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
        </Paper>
        <Paper
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
          }}
        >
          <Typography variant="h3">Prescription</Typography>
          <img
            src={prescriptionIMG_URL}
            style={{
              objectFit: "contain",
              width: "50%",
              height: "80%",
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default RequestDetails;
