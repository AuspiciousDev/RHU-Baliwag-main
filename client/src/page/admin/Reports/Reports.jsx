import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import { useInventoriesContext } from "../../../hooks/useInventoryContext";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
  Tabs,
  Tab,
  FormControl,
  TextField,
} from "@mui/material";
import { format } from "date-fns-tz";

import {
  CheckCircle,
  DeleteOutline,
  ArchiveOutlined,
  DescriptionOutlined,
  MoveToInboxOutlined,
  WhatshotOutlined,
  HourglassTopOutlined,
} from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Paper_Active from "../../../components/global/Paper_Active";
import Paper_Icon from "../../../components/global/Paper_Icon";
import useAuth from "../../../hooks/useAuth";
import PropTypes from "prop-types";
import { darken, lighten } from "@mui/material/styles";
import { useTransactionsContext } from "../../../hooks/useTransactionContext";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Paper_Totals from "../../../components/Dashboard/Paper_Totals";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbar />
    </GridToolbarContainer>
  );
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dispenses, setDispenses] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { stocks, stockDispatch } = useInventoriesContext();
  const { transactions, transactionDispatch } = useTransactionsContext();
  const [value, setValue] = React.useState(0);

  const [DateFilter, setDateFilter] = useState(new Date());
  const [DateFilterEnd, setDateFilterEnd] = useState(null);
  const [DateFilterError, setDateFilterError] = useState(false);
  const handleDate = (newValue) => {
    setDateFilter(newValue);
    setDateFilterError(false);
  };
  const handleEndDate = (newValue) => {
    setDateFilterEnd(newValue);
    setDateFilterError(false);
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
  const handleChange = (event, newValue) => {
    console.log(
      "🚀 ~ file: Reports.jsx:131 ~ handleChange ~ newValue:",
      newValue
    );
    setValue(newValue);
    if (newValue === 1) {
      DateFilter
        ? setDateFilter(new Date(DateFilter), "MM yyyy")
        : setDateFilter(new Date(), "MM yyyy");
    } else {
      setDateFilter(null);
    }

    setDateFilterEnd(null);
  };
  const [page, setPage] = React.useState(15);
  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        console.log(
          "🚀 ~ file: Reports.jsx:144 ~ handleChange ~ newValue:",
          format(new Date(DateFilter), "MM yyyy")
        );
        let apiMonth = format(new Date(DateFilter), "MM");
        let apiYear = format(new Date(DateFilter), "yyyy");
        var apiCall;
        setLoadingDialog({ isOpen: true });
        if (value === 0) {
          apiCall = "/api/transaction/reportGenDaily";
        } else if (value === 1) {
          apiCall = `/api/transaction/reportGen/${apiMonth}/${apiYear}`;
        } else if (value === 2) {
          let apiStartDate = format(new Date(DateFilter), "yyyy-MM-dd");
          let apiEndDate = format(new Date(DateFilterEnd), "yyyy-MM-dd");
          apiCall = `/api/transaction/reportGenDated/${apiStartDate}/${apiEndDate}`;
        }
        const response = await axiosPrivate.get(apiCall);
        if (response.status === 200) {
          const json = await response.data;
          console.log(
            "🚀 ~ file: Reports.jsx:144 ~ getUsersDetails ~ json:",
            json
          );
          setDispenses(json);
        }
        setLoadingDialog({ isOpen: false });
      } catch (error) {
        console.log(
          "🚀 ~ file: Reports.jsx:176 ~ getUsersDetails ~ error:",
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
  }, [value, DateFilter, DateFilterEnd, transactionDispatch]);

  // const handleWeek = () => {
  //   let currentDate = new Date(DateFilter);
  //   console.log(
  //     "🚀 ~ file: Reports.jsx:185 ~ handleWeek ~ currentDate:",
  //     currentDate
  //   );

  //   let newCurrDate = new Date(DateFilterEnd);
  //   console.log(
  //     "🚀 ~ file: Reports.jsx:188 ~ handleWeek ~ newCurrDate:",
  //     newCurrDate
  //   );

  //   let startDate = new Date(currentDate.getFullYear(), 0, 1);
  //   let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  //   let weekNumber = Math.ceil(days / 7);

  //   let newStartDate = new Date(newCurrDate.getFullYear(), 0, 1);
  //   let newDays = Math.floor(
  //     (newCurrDate - newStartDate) / (24 * 60 * 60 * 1000)
  //   );
  //   let newWeekNumber = Math.ceil(newDays / 7);
  //   console.log(
  //     "🚀 ~ file: Reports.jsx:180 ~ handleWeek ~ newWeekNumber:",
  //     newWeekNumber
  //   );

  //   if (newWeekNumber === weekNumber) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   try {
  // const existingItem = transactions
  //   .filter((fill) => {
  //     return (
  //       format(new Date(fill?.createdAt), "MMMM dd yyyy") !==
  //       format(new Date(), "MMMM dd yyyy")
  //     );
  //   })
  //   .map((val) => {
  //     return val.items.map((va1) => {
  //       return va1.medID, va1.quantity;
  //     });
  //   });
  // console.log(
  //   "🚀 ~ file: Reports.jsx:181 ~ useEffect ~ existingItem:",
  //   existingItem
  // );
  //     let object = [...map.entries()].reduce((obj, [key, value]) => {
  //       obj[key] = value;
  //       return obj;
  //     }, {});
  //   } catch {}
  // }, [value, loadingDialog, transactionDispatch]);

  const columns = [
    {
      field: "_id",
      headerName: "Medicine ID",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Typography textTransform="uppercase" fontWeight={600}>
            {params.value}
          </Typography>
        );
      },
    },

    {
      field: "genericName",
      headerName: "Generic Name",
      align: "center",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "brandName",
      headerName: "Brand Name",
      align: "center",
      headerAlign: "center",
      width: 200,
      valueFormatter: (params) => (params?.value ? params?.value : "-"),
    },

    {
      field: "totalAmount",
      headerName: "Quantity",
      align: "center",
      headerAlign: "center",
      width: 150,
    },
  ];

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
        }}
      >
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
                Reports
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            height: "350px",
            backgroundColor: "white",
          }}
        >
          <ResponsiveContainer width="90%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dispenses}
              margin={{
                top: 30,
                bottom: 5,
              }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="genericName"
                padding={{ left: 10, right: 10 }}
                style={{
                  textTransform: "capitalize",
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalAmount"
                name={"Quantity"}
                fill={`${colors.secondary[500]}`}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "2fr 2fr 2fr 2fr" },
            margin: "1em 0em",
          }}
          gap={2}
        >
          <span></span>
          <Paper_Totals
            // to={"inventory"}
            // value={
            //   stocks
            //     ? stocks.filter((filter) => {
            //         return filter.status === true;
            //       }).length
            //     : "0"
            // }
            icon={<WhatshotOutlined />}
            description="Fast Moving Item"
          />
          <Paper_Totals
            // to={"request"}
            // value={requests ? requests.length : "0"}
            icon={<HourglassTopOutlined />}
            description="Slow Moving Item"
          />
          <span></span>
        </Box> */}
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <greenOnly
              position="static"
              sx={{ backgroundColor: colors.greenOnly[100] }}
              enableColorOnDark
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="full width tabs example"
                variant="fullWidth"
              >
                <Tab
                  label="Daily"
                  {...a11yProps(0)}
                  sx={{ fontWeight: "bold" }}
                />

                <Tab
                  label="Monthly"
                  {...a11yProps(1)}
                  sx={{ fontWeight: "bold" }}
                />
                <Tab
                  label="Date"
                  {...a11yProps(2)}
                  sx={{ fontWeight: "bold" }}
                />
              </Tabs>
            </greenOnly>
          </Box>
          <TabPanel value={value} index={0}>
            <Box sx={{ m: 1, mt: 2, mb: 2 }}>
              <TextField
                autoComplete="off"
                label="Date Today"
                value={format(new Date(), "MMMM dd yyyy")}
              />
            </Box>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                "& .super-app-theme--Low": {
                  bgcolor: "#F68181",
                  "&:hover": {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.warning.main,
                        theme.palette.mode
                      ),
                  },
                },
              }}
            >
              <DataGrid
                rows={
                  dispenses
                    ? dispenses.filter((fill) => {
                        return (
                          format(new Date(), "MMMM dd yyyy") ===
                          format(new Date(DateFilter), "MMMM dd yyyy")
                        );
                      })
                    : []
                }
                getRowId={(row) => row?._id}
                columns={columns}
                pageSize={page}
                onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                rowsPerPageOptions={[15, 50]}
                pagination
                sx={{
                  height: "500px",
                  "& .MuiDataGrid-cell": {
                    textTransform: "capitalize",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // status: auth.userType === "admin" ? true : false,
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
                // getRowClassName={(params) =>
                //   `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
                // }
              />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box sx={{ m: 1, mt: 2, mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  inputFormat="MMMM YYYY"
                  value={DateFilter}
                  onChange={handleDate}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      disabled
                      {...params}
                      error={DateFilterError}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                "& .super-app-theme--Low": {
                  bgcolor: "#F68181",
                  "&:hover": {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.warning.main,
                        theme.palette.mode
                      ),
                  },
                },
              }}
            >
              <DataGrid
                rows={
                  dispenses && DateFilter
                    ? dispenses.map((val) => {
                        return val;
                      })
                    : []
                }
                getRowId={(row) => row?._id}
                columns={columns}
                pageSize={page}
                onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                rowsPerPageOptions={[15, 50]}
                pagination
                sx={{
                  height: "500px",
                  "& .MuiDataGrid-cell": {
                    textTransform: "capitalize",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // lotNum: false,
                      // createdAt: false,
                      // updatedAt: false,
                      // _id: false,
                      // createdBy: false,
                      // status: false,
                      // // status: auth.userType === "admin" ? true : false,
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
                // getRowClassName={(params) =>
                //   `super-app-theme--${params.row.quantity > 20 ? "High" : "Low"}`
                // }
              />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Box sx={{ display: "flex", gap: 2, m: 1, mt: 2, mb: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/DD/YYYY"
                  value={DateFilter}
                  onChange={handleDate}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      disabled
                      {...params}
                      error={DateFilterError}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/DD/YYYY"
                  value={DateFilterEnd}
                  onChange={handleEndDate}
                  renderInput={(params) => (
                    <TextField autoComplete="off" disabled {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>

            <Box
              sx={{
                height: "100%",
                width: "100%",
                "& .super-app-theme--Low": {
                  bgcolor: "#F68181",
                  "&:hover": {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.warning.main,
                        theme.palette.mode
                      ),
                  },
                },
              }}
            >
              <DataGrid
                rows={
                  dispenses
                    ? dispenses.map((val) => {
                        return val;
                      })
                    : []
                }
                getRowId={(row) => row?._id}
                columns={columns}
                pageSize={page}
                onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                rowsPerPageOptions={[15, 50]}
                pagination
                sx={{
                  height: "500px",
                  "& .MuiDataGrid-cell": {
                    textTransform: "capitalize",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      // status: auth.userType === "admin" ? true : false,
                    },
                  },
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
                // getRowClassName={(params) =>
                //   `super-app-theme--${
                //     params.row.quantity > params.row.quantity ? "High" : "Low"
                //   }`
                // }
              />
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default Reports;
