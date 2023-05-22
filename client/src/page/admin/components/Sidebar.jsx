import React from "react";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import {
  DashboardOutlined,
  MenuOutlined,
  Person2Outlined,
  ArchiveOutlined,
  LogoutOutlined,
  DvrOutlined,
  MoveToInboxOutlined,
  InventoryOutlined,
  WarehouseOutlined,
  AdminPanelSettingsOutlined,
  IosShareOutlined,
} from "@mui/icons-material";
import "react-pro-sidebar/dist/css/styles.css";
import logo from "../../../assets/logo.png";
import LogoutDialogue from "../../../global/LogoutDialogue";
import LoadingDialogue from "../../../global/LoadingDialogue";
import useLogout from "../../../hooks/useLogout";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var subLocation = location.pathname;
  return (
    <MenuItem
      active={
        subLocation === "/admin"
          ? subLocation === to
          : subLocation.substring(7).includes(to)
      }
      style={{
        color: colors.black[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [activeYear, setActiveYear] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [logoutDialog, setLogoutDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [loadingDialog, setLoadingDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const logout = useLogout();
  const signOut = async () => {
    setLogoutDialog({
      isOpen: true,
      message: `Are you sure you want to logout?`,
      onLogout: async () => {
        setLoadingDialog({ isOpen: true });
        await logout();
        navigate("/");
        setLoadingDialog({ isOpen: false });
      },
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: { lg: "1000px", xl: "100%" },
        "& .pro-sidebar-inner": {
          background: `${colors.black[900]} !important`,
          color: `${colors.primary[100]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },

        "& .pro-inner-item:hover": {
          backgroundColor: `${colors.secondary[500]}!important`,
          color: `${colors.whiteOnly[500]} !important`,
        },
        "& .pro-menu-item.active": {
          backgroundColor: `${colors.secondary[500]}!important`,
          color: `${colors.whiteOnly[500]} !important`,
        },
      }}
    >
      <LogoutDialogue
        logoutDialog={logoutDialog}
        setLogoutDialog={setLogoutDialog}
      />
      <LoadingDialogue
        loadingDialog={loadingDialog}
        setLoadingDialog={setLoadingDialog}
      />
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <SidebarHeader>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlined /> : undefined}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlined />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {isCollapsed && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                m="10px 0"
              >
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 0.5,
                    borderRadius: "25px",
                  }}
                >
                  <Avatar
                    alt="profile-user"
                    sx={{ width: "50px", height: "50px" }}
                    src={auth?.imgURL}
                    style={{
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </Paper>
              </Box>
            )}
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mb: "1em",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  padding=" 10px 0 10px 15px"
                >
                  <Paper
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 0.5,
                      borderRadius: "25px",
                    }}
                  >
                    <Avatar
                      alt="profile-user"
                      sx={{ width: "50px", height: "50px" }}
                      src={auth?.imgURL}
                      style={{
                        objectFit: "contain",
                        borderRadius: "50%",
                      }}
                    />
                  </Paper>

                  <Box ml="10px">
                    <Typography
                      variant="h6"
                      width="180px"
                      color={colors.black[50]}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {auth.firstName} {auth.lastName}
                    </Typography>
                    <Typography
                      color={colors.primary[100]}
                      variant="subtitle2"
                      textTransform="uppercase"
                      fontWeight={800}
                    >
                      {auth.userType}
                    </Typography>
                  </Box>
                </Box>
                {/* <Typography
                  variant="h6"
                  color={colors.primary[900]}
                  sx={{ m: "5px 0 5px 20px" }}
                >
                  School Year
                </Typography>
                <Typography variant="h3" sx={{ m: "5px 0 5px 20px" }}>
                  {activeYear ? "S.Y. " + activeYear : "NONE"}
                </Typography> */}
              </Box>
            )}
          </SidebarHeader>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<DashboardOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          {!isCollapsed ? (
            <Typography
              variant="h6"
              color={colors.primary[100]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Records
            </Typography>
          ) : (
            <SidebarHeader />
          )}
          <Item
            title="Requests"
            to="request"
            icon={<MoveToInboxOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          {/* <Item
            title="Walk-in"
            to="walk-in"
            icon={<MoveToInboxOutlined />}
            selected={selected}
            setSelected={setSelected}
          /> */}
          <Item
            title="Transactions"
            to="transaction"
            icon={<DvrOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          {!isCollapsed ? (
            <Typography
              variant="h6"
              color={colors.primary[100]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Manage
            </Typography>
          ) : (
            <SidebarHeader />
          )}
          <Item
            title="Inventory"
            to="inventory"
            icon={<WarehouseOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Restocks"
            to="restock"
            icon={<InventoryOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Patients"
            to="patient"
            icon={<Person2Outlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Admin"
            to="admin"
            icon={<AdminPanelSettingsOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Report"
            to="reports"
            icon={<IosShareOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          {!isCollapsed ? (
            <Typography
              variant="h6"
              color={colors.primary[100]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Archive
            </Typography>
          ) : (
            <SidebarHeader />
          )}
          <Item
            title="Archives"
            to="archive"
            icon={<ArchiveOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <SidebarFooter />
          {!isCollapsed && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                m: 2,
              }}
            >
              <Button
                variant="contained"
                type="button"
                startIcon={<LogoutOutlined />}
                sx={{ backgroundColor: colors.redDark[500], color: "white" }}
                onClick={() => {
                  signOut();
                }}
                disableRipple
              >
                Logout
              </Button>
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
