import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { tokens } from "../../../theme";
import ConfirmDialogue from "../../../global/ConfirmDialogue";
import SuccessDialogue from "../../../global/SuccessDialogue";
import ErrorDialogue from "../../../global/ErrorDialogue";
import ValidateDialogue from "../../../global/ValidateDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
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
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns-tz";
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";

const AdminRecord = () => {
  const { username } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [val, setVal] = useState([]);
  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        setLoadingDialog({ isOpen: true });
        const response = await axiosPrivate.get(`/api/user/search/${username}`);
        if (response.status === 200) {
          const json = await response.data;
          console.log("Employees GET : ", json);
          setLoadingDialog({ isOpen: false });
          setVal(json);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: UserProfile.jsx:64 ~ getUsersDetails ~ error",
          error
        );
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
        setLoadingDialog({ isOpen: false });
      }
    };
    getUsersDetails();
  }, []);

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
              Admin &#62; {username}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 2, mt: 2 }}
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding="20px"
            gap={2}
          >
            <Paper
              sx={{
                borderRadius: "65px",
                width: "130px",
                height: "130px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                alt="profile-user"
                sx={{ width: "100%", height: "100%" }}
                src={val?.imgURL}
                style={{
                  objectFit: "contain",
                  borderRadius: "50%",
                  border: `5px solid ${colors.secondary[500]}`,
                }}
              />
            </Paper>
            <Typography
              variant="h3"
              fontWeight="bold"
              textTransform="capitalize"
              sx={{ mt: "10px" }}
              textAlign="center"
            >
              {val?.middleName
                ? val?.firstName +
                  " " +
                  val?.middleName.charAt(0) +
                  ". " +
                  val?.lastName
                : val?.firstName + " " + val?.lastName}
            </Typography>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "10px",
                padding: "5px 30px",
                alignItems: "center",
                backgroundColor: colors.secondary[500],
                color: "white",
              }}
            >
              {/* <School /> */}
              <Typography textTransform="uppercase">{val?.userType}</Typography>
            </Paper>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="h6" textAlign="center">
                Date Created:
              </Typography>

              <Typography variant="h6" fontWeight={800}>
                {val?.createdAt &&
                  format(new Date(val?.createdAt), "MMMM dd, yyyy")}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ position: "relative" }} elevation={2}>
          <Box sx={{ position: "absolute", top: 5, right: 5 }}>
            <IconButton onClick={handleClick}>
              <MoreVert sx={{ fontSize: "20pt" }} />
              {/* <PersonOutlinedIcon sx={{ fontSize: "20pt" }} /> */}
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem>
                <Link
                  to={`/admin/admin/edit/${val?.username}`}
                  style={{
                    alignItems: "center",
                    color: colors.black[100],
                    textDecoration: "none",
                  }}
                >
                  Edit Profile
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ padding: 1, display: "grid", gridTemplateRows: "1fr" }}>
            <Box
              sx={{ display: "flex", flexDirection: "column" }}
              padding="10px 10px 0 10px"
            >
              <Typography variant="h4">Admin Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Gender : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.gender}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Date of Birth : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.dateOfBirth
                      ? format(new Date(val?.dateOfBirth), "MMMM dd, yyyy")
                      : ""}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: "20px" }} />
            </Box>
            <Box padding="10px 10px 0 10px">
              <Typography variant="h4"> Address Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Address : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.address}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>City : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.city}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Province : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.province}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: "20px" }} />
            </Box>
            <Box padding="10px 10px 0 10px">
              <Typography variant="h4">Contact Information</Typography>
              <Box
                mt="10px"
                display="grid"
                sx={{
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                }}
              >
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Email : </Typography>
                  <Typography ml="10px" fontWeight="bold">
                    {val?.email}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Telephone : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.telephone}
                  </Typography>
                </Box>
                <Box mt="10px" display="flex" flexDirection="row">
                  <Typography>Mobile Number : </Typography>
                  <Typography
                    ml="10px"
                    textTransform="capitalize"
                    fontWeight="bold"
                  >
                    {val?.mobile && "09" + val?.mobile}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminRecord;
