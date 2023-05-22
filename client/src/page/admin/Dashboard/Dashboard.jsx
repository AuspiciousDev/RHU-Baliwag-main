import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Avatar,
  Button,
} from "@mui/material";
import { format } from "date-fns-tz";
import React from "react";
import { tokens } from "../../../theme";
import Paper_Totals from "../../../components/Dashboard/Paper_Totals";
import {
  Person2Outlined,
  DvrOutlined,
  MoveToInboxOutlined,
  DescriptionOutlined,
  CheckCircle,
  Cancel,
  AccessTime,
  QrCodeScanner,
} from "@mui/icons-material";

import LoadingDialogue from "../../../global/LoadingDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import WelcomeDialogue from "../../../global/WelcomeDialogue";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useUsersContext } from "../../../hooks/useUserContext";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { useLoginsContext } from "../../../hooks/useLoginContext";
import { useRequestsContext } from "../../../hooks/useRequestContext";
import Paper_Status from "../../../components/global/Paper_Status";
import { useTransactionsContext } from "../../../hooks/useTransactionContext";

const ADMIN_Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { users, userDispatch } = useUsersContext();
  const { stocks, stockDispatch } = useInventoriesContext();
  const { logins, loginDispatch } = useLoginsContext();
  const { requests, requestDispatch } = useRequestsContext();
  const { transactions, transactionDispatch } = useTransactionsContext();

  const [getStudCount, setStudCount] = useState(0);
  const [getSecCount, setSecCount] = useState(0);
  const [activeYear, setActiveYear] = useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
  });
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [welcomeDialog, setWelcomeDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("newLogin"));
    if (items) {
      setWelcomeDialog({
        isOpen: true,
        message: `Welcome,  `,
        type: `${auth.userType}`,
      });
      localStorage.setItem("newLogin", false);
    }
  }, []);

  useEffect(() => {
    const getOverviewDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const apiUsers = await axiosPrivate.get("/api/user");
        const apiStocks = await axiosPrivate.get("/api/inventory");
        const apiLogins = await axiosPrivate.get("/api/loginHistory");
        const apiRequests = await axiosPrivate.get("/api/request/info");
        const apiTransaction = await axiosPrivate.get("/api/transaction");
        const apiTransactionExpiry = await axiosPrivate.get(
          "/api/transaction/allTransactions"
        );
        if (apiTransactionExpiry.status === 200) {
        }
        if (apiUsers.status === 200) {
          const json = await apiUsers.data;
          console.log(json);
          userDispatch({ type: "SET_USERS", payload: json });
        }
        if (apiStocks.status === 200) {
          const json = await apiStocks.data;
          console.log(json);
          stockDispatch({ type: "SET_STOCKS", payload: json });
        }
        if (apiLogins.status === 200) {
          const json = await apiLogins.data;
          console.log(
            "🚀 ~ file: Dashboard.jsx:105 ~ getOverviewDetails ~ json",
            json
          );
          loginDispatch({ type: "SET_LOGINS", payload: json });
        }
        if (apiRequests.status === 200) {
          const json = await apiRequests.data;
          console.log(json);
          requestDispatch({ type: "SET_REQUESTS", payload: json });
        }
        if (apiTransaction.status === 200) {
          const json = await apiTransaction.data;
          console.log(json);
          transactionDispatch({ type: "SET_TRANSACTIONS", payload: json });
        }

        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: Dashboard.jsx:91 ~ getOverviewDetails ~ error",
          error
        );
        setLoadingDialog({ isOpen: false });
        if (!error?.response) {
          setErrorDialog({
            isOpen: true,
            message: `No server response`,
          });
        } else if (error.response.status === 400) {
          // setErrorDialog({
          //   isOpen: true,
          //   message: `${error.response.data.message}`,
          // });
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
        }
      }
    };
    getOverviewDetails();
  }, []);

  const tableDetails = ({ val }) => {
    return (
      <TableRow key={val.reqID}>
        <TableCell align="left" sx={{ textTransform: "uppercase" }}>
          <Box display="flex" gap={2} width="60%">
            <Link
              to={`/admin/request/details/${val?.reqID}`}
              style={{
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Paper
                sx={{
                  padding: "2px 20px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: colors.whiteOnly[500],
                  alignItems: "center",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ color: colors.blackOnly[500] }}
                >
                  {val?.reqID}
                </Typography>
              </Paper>
            </Link>
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {val?.middleName
            ? val.firstName + " " + val.middleName + " " + val.lastName
            : val.firstName + " " + val.lastName}
        </TableCell>
        <TableCell align="left"> {val?.email || "-"}</TableCell>

        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
          {format(new Date(val.createdAt), "MMMM dd, yyyy")}
        </TableCell>
        <TableCell align="left">
          {val?.status === "approved" ? (
            <Paper_Status icon={<CheckCircle />} title={"Approved"} />
          ) : val?.status === "denied" ? (
            <Paper_Status icon={<Cancel />} title={"Denied"} />
          ) : (
            <Paper_Status icon={<AccessTime />} title={"pending"} />
          )}
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Box className="container-layout_body_contents">
      <ErrorDialogue
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <WelcomeDialogue
        welcomeDialog={welcomeDialog}
        setWelcomeDialog={setWelcomeDialog}
      />
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          margin: "0 0 10px 0",
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
              }}
            >
              DASHBOARD
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {auth.userType === "admin" && (
              <Button
                type="button"
                color="secondary"
                startIcon={<QrCodeScanner />}
                onClick={() => {
                  navigate("patient/scan");
                }}
                variant="contained"
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  height: "50px",
                  marginLeft: { xs: "0", sm: "20px" },
                  marginTop: { xs: "20px", sm: "0" },
                  color: "white",
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Scan Patient
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "2fr 2fr 2fr 2fr" },
          margin: "1em 0em",
        }}
        gap={2}
      >
        <Paper_Totals
          to={"inventory"}
          value={
            stocks
              ? stocks.filter((filter) => {
                  return filter.status === true;
                }).length
              : "0"
          }
          icon={<DescriptionOutlined />}
          description="Total Number of Medicines"
        />
        <Paper_Totals
          to={"request"}
          value={requests ? requests.length : "0"}
          icon={<MoveToInboxOutlined />}
          description="Total Number of Requests"
        />
        <Paper_Totals
          to={"transaction"}
          value={transactions ? transactions.length : "0"}
          icon={<DvrOutlined />}
          description="Total Number of Transactions"
        />
        <Paper_Totals
          to={"user"}
          value={users ? users.length : "0"}
          icon={<Person2Outlined />}
          description="Total Number of Patients"
        />
      </Box>
      <Box height="100%">
        <Box
          sx={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "6fr 2fr" },
          }}
        >
          <Paper elevation={2} sx={{ position: "relative", p: 2 }}>
            <Typography
              variant="h4"
              mb={1}
              sx={{
                borderLeft: `5px solid ${colors.secondary[500]}`,
                paddingLeft: 2,
              }}
            >
              Recent Requests
            </Typography>
            <Divider sx={{ mt: 2 }} />
            <TableContainer>
              <Table sx={{ minWidth: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Request Date</TableCell>
                    <TableCell align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests &&
                    requests
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((val) => {
                        return val && tableDetails({ val });
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <TablePagination
              sx={{
                position: { xs: "", sm: "absolute" },
                bottom: 1,
                right: 1,
              }}
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={requests && requests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "100%",
              mt: { xs: 2, sm: 0 },
              ml: { xs: 0, sm: 2 },
              padding: { xs: "20px 0 20px 0", sm: 2 },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Typography
                variant="h4"
                mb={1}
                sx={{
                  borderLeft: `5px solid ${colors.secondary[500]}`,
                  paddingLeft: 2,
                }}
              >
                Recent Logins
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 1,
                }}
              >
                {logins &&
                  logins.slice(0, 6).map((val, key) => (
                    <Paper
                      key={key}
                      elevation={2}
                      sx={{
                        height: "100%",
                        color: `${colors.black[100]}`,
                        display: "flex",
                        flexDirection: "row",
                        padding: "10px",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        to={`/admin/admin/profile/${val?.username}`}
                        style={{
                          alignItems: "center",
                          color: colors.black[100],
                          textDecoration: "none",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            alt="profile-user"
                            sx={{ width: "35px", height: "35px" }}
                            src={val.imgURL}
                            style={{
                              marginRight: "15px",
                              objectFit: "contain",
                              borderRadius: "50%",
                            }}
                          />
                          <Box>
                            <Typography textTransform="capitalize">
                              {val.username}
                            </Typography>
                            <Typography textTransform="capitalize">
                              {format(new Date(val.createdAt), "hh:mm a, EEEE")}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    </Paper>
                  ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ADMIN_Dashboard;
