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
} from "@mui/material";
import {
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Search,
  DeleteOutline,
  AccessTime,
  QrCode,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useRequestsContext } from "../../../hooks/useRequestContext";
import { useTransactionsContext } from "../../../hooks/useTransactionContext";

import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import Paper_Status from "../../../components/global/Paper_Status";
import Paper_Icon from "../../../components/global/Paper_Icon";
import { format } from "date-fns-tz";
import QRCode from "react-qr-code";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
const UserTransactionDetails = () => {
  const { transID } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { requests, requestDispatch } = useRequestsContext();
  const { transactions, transactionDispatch } = useTransactionsContext();

  const [reqID, setReqID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [transactor, setTransactor] = useState("");
  const [status, setStatus] = useState("");
  const [releasedDate, setReleasedDate] = useState("");

  let [items, setItems] = useState([]);

  const [page, setPage] = React.useState(15);

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
  const [decisionDialog, setDecisionDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  useEffect(() => {
    const getUsersDetails = async () => {
      let reqIDl;
      try {
        setLoadingDialog({ isOpen: true });

        const response1 = await axiosPrivate.get(
          `/api/transaction/search/${transID}`
        );
        if (response1.status === 200) {
          const json = await response1.data;
          console.log(
            "🚀 ~ file: TransactionDetails.jsx:115 ~ getUsersDetails ~ json",
            json
          );
          setReqID(json?.reqID || "");
          reqIDl = json?.reqID;
          setCreatedAt(json?.createdAt || "");
          setTransactor(json?.transactor || "");
          setItems(json?.items || []);
          setStatus(json?.status || "-");
          setReleasedDate(json?.updatedAt || null);
        }

        const response = await axiosPrivate.get(
          `/api/request/search/${reqIDl}`
        );
        if (response.status === 200) {
          const json1 = await response.data[0];
          const json = await response.data[0].profile;
          setFirstName(json?.firstName || "");
          setMiddleName(json?.middleName || "");
          setLastName(json?.lastName || "");
          setEmail(json?.email || "");
          setMobile(json?.mobile || "");
          setAddress(json?.address || "");
          setCity(json?.city || "");
          setProvince(json?.province || "");
          setCreatedAt(json?.createdAt || null);
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: TransactionDetails.jsx:150 ~ getUsersDetails ~ error:",
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
  }, [requestDispatch, transactions]);
  const toggleStatus = async ({ val, newStat }) => {
    setDecisionDialog({
      ...decisionDialog,
      isOpen: false,
    });

    const data = {
      username,
      transID,
      transactor: auth.username,
      items,
      status: newStat,
    };
    console.log(
      "🚀 ~ file: TransactionDetails.jsx:198 ~ toggleStatus ~ data:",
      data
    );

    const apiTransact = await axiosPrivate.patch(
      `/api/transaction/update/status/${transID}`,
      JSON.stringify(data)
    );
    if (apiTransact.status === 200) {
      const response = await axiosPrivate.get("/api/transaction");
      if (response.status === 200) {
        const json = await response.data;
        transactionDispatch({ type: "SET_TRANSACTIONS", payload: json });
        setSuccessDialog({
          isOpen: true,
          message: `Transaction  ${transID} ${
            newStat === "released" ? "has been released!" : "was unclaimed!"
          }`,
        });
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
              Transaction &#62; details
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
            gridTemplateColumns: "0.5fr 1fr 1fr",
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Box
            sx={{
              height: "auto",
              margin: "auto auto",
              maxWidth: 200,
              width: "100%",
              border: "solid 5px white",
            }}
          >
            <QRCode
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={transID}
              viewBox={`0 0 256 256`}
            />
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
            <Typography textAlign="end">Transaction ID : </Typography>
            <Typography fontWeight={600}>{transID || "-"}</Typography>
            <Typography textAlign="end">Request ID : </Typography>
            <Typography fontWeight={600}>{reqID || "-"}</Typography>
            <Typography textAlign="end">Client Name : </Typography>
            <Typography fontWeight={600}>
              {middleName
                ? firstName + " " + middleName.charAt(0) + ". " + lastName
                : firstName + " " + lastName}
            </Typography>
            <Typography textAlign="end">Mobile : </Typography>
            <Typography fontWeight={600}>
              {mobile ? "09" + mobile : ""}
            </Typography>
            <Typography textAlign="end">Email : </Typography>
            <Typography
              fontWeight={600}
              sx={{ textTransform: "lowercase !important" }}
            >
              {email}
            </Typography>
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
            <Typography fontWeight={600}>{address}</Typography>

            <Typography textAlign="end">City : </Typography>
            <Typography fontWeight={600}>{city}</Typography>

            <Typography textAlign="end">Province : </Typography>
            <Typography fontWeight={600}>{province}</Typography>
            <Typography textAlign="end">Transactor : </Typography>
            <Typography fontWeight={600}>{transactor}</Typography>
            <Typography textAlign="end">Approved Date : </Typography>
            <Typography fontWeight={600}>
              {createdAt && format(new Date(createdAt), "MMMM dd, yyyy")}
            </Typography>
            <Typography textAlign="end">Released Date : </Typography>
            <Typography fontWeight={600}>
              {releasedDate && format(new Date(releasedDate), " MMMM dd, yyyy")}
            </Typography>
            <Typography textAlign="end">Status : </Typography>
            <Box>
              <ButtonBase
                disabled={status === "released"}
                onClick={() => {
                  setValidateDialog({
                    isOpen: true,
                    onConfirm: () => {
                      setDecisionDialog({
                        isOpen: true,
                        title: `Release transaction ${transID}? `,
                        onConfirm: () => {
                          toggleStatus({
                            val: status,
                            newStat: "released",
                          });
                        },
                        onDeny: () => {
                          toggleStatus({
                            val: status,
                            newStat: "unclaimed",
                          });
                        },
                      });
                    },
                  });
                }}
              >
                {status === "released" ? (
                  <Paper_Status icon={<CheckCircle />} title={"released"} />
                ) : status === "unclaimed" ? (
                  <Paper_Status icon={<Cancel />} title={"unclaimed"} />
                ) : (
                  <Paper_Status icon={<AccessTime />} title={"releasing"} />
                )}
              </ButtonBase>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ m: "1em 0" }} />
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
              <Table size="small" sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine ID</TableCell>
                    <TableCell align="left">Generic Name</TableCell>
                    <TableCell align="left">Brand Name</TableCell>
                    <TableCell align="left">Quantity</TableCell>
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
                          <TableCell>{val?.genericName}</TableCell>
                          <TableCell>{val?.brandName}</TableCell>
                          <TableCell>{val?.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTransactionDetails;
