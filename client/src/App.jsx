import "./App.css";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
// ! PUBLIC ROUTES
import NotFound404 from "./page/public/NotFound404";
import Home from "./page/public/Home";
import Login from "./page/public/Login";
import ForgotPassword from "./page/public/ForgotPassword";
import Register from "./page/public/Register";

import InventoryPublic from "./page/admin/Inventory/InventoryPublic";
import RequestCreatePublic from "./page/admin/Request/RequestCreatePublic";
// ! PRIVATE ROUTES

import PersistLogin from "./page/components/PersistLogin";
import RequireAuth from "./page/components/RequireAuth";
import Activate from "./page/public/Activate";

import Dashboard from "./page/admin/Dashboard/Dashboard";
import ADMIN_Layout from "./page/admin/Layout/ADMIN_Layout";
import User from "./page/admin/User/User";
import UserCreate from "./page/admin/User/UserCreate";
import UserRecord from "./page/admin/User/UserRecord";
import UserRecordEdit from "./page/admin/User/UserRecordEdit";
import ChangePassword from "./page/admin/User/ChangePassword";

import Inventory from "./page/admin/Inventory/Inventory";
import Archive from "./page/admin/Archive/Archive";
import Restock from "./page/admin/Restock/Restock";
import Transaction from "./page/admin/Transaction/Transaction";
import InventoryCreate from "./page/admin/Inventory/InventoryCreate";
import RestockCreate from "./page/admin/Restock/RestockCreate";
import Request from "./page/admin/Request/Request";
//! New
import RequestCreatee from "./page/admin/Request/RequestCreatee";
//! New
import RequestCreate from "./page/admin/Request/RequestCreate";
import RequestDetails from "./page/admin/Request/RequestDetails";
import TransactionsDetails from "./page/admin/Transaction/TransactionDetails";
import TransactionScan from "./page/admin/Transaction/TransactionScan";
import InventoryEdit from "./page/admin/Inventory/InventoryEdit";
import ResetPassword from "./page/public/ResetPassword";
import Admin from "./page/admin/Admin/Admin";
import AdminCreate from "./page/admin/Admin/AdminCreate";
import AdminRecord from "./page/admin/Admin/AdminRecord";
import AdminRecordEdit from "./page/admin/Admin/AdminRecordEdit";
import WalkIn from "./page/admin/Walk-in/WalkIn";
import Prescription from "./page/admin/Request/Prescription";

//!USER
import USER_Layout from "./page/user/Layout/USER_Layout";
import UserDashboard from "./page/user/Dashboard/UserDashboard";
import UserRequest from "./page/user/Request/UserRequest";
import UserRequestCreate from "./page/user/Request/UserRequestCreate";
import UserRequestDetails from "./page/user/Request/UserRequestDetails";
import UserTransaction from "./page/user/Releasing/UserTransaction";
import UserTransactionDetails from "./page/user/Releasing/UserTransactionDetails";
import UUserRecordEdit from "./page/user/User/UUserRecordEdit";
import UUserRecord from "./page/user/User/UUserRecord";
import UserScan from "./page/admin/User/UserScan";
import Reports from "./page/admin/Reports/Reports";

const USER_TYPE = {
  ADMIN: "admin",
  USER: "user",
};
function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="auth/activate/:activation_token"
              element={<Activate />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/public/inventory" element={<InventoryPublic />} />
            <Route path="/public/request" element={<RequestCreatePublic />} />
            {/* <Route path="/register" element={""} />
              <Route path="unauthorized" element={""} />
              */}
            <Route
              path="auth/reset-password/:resetToken"
              element={<ResetPassword />}
            />

            <Route path="*" element={<NotFound404 />} />
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.ADMIN]} />}>
                <Route path="/admin" element={<ADMIN_Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="request" element={<Request />} />
                  <Route path="walk-in" element={<WalkIn />} />
                  <Route
                    path="request/details/:reqID"
                    element={<RequestDetails />}
                  />
                  <Route
                    path="request/prescription/:reqID"
                    element={<Prescription />}
                  />
                  <Route path="request/create" element={<RequestCreate />} />
                  <Route path="transaction" element={<Transaction />} />
                  <Route
                    path="transaction/details/:transID"
                    element={<TransactionsDetails />}
                  />
                  <Route
                    path="transaction/scan"
                    element={<TransactionScan />}
                  />
                  <Route path="inventory" element={<Inventory />} />
                  <Route
                    path="inventory/edit/:medID"
                    element={<InventoryEdit />}
                  />
                  <Route
                    path="inventory/create"
                    element={<InventoryCreate />}
                  />
                  <Route path="restock" element={<Restock />} />
                  <Route path="restock/create" element={<RestockCreate />} />
                  <Route path="patient" element={<User />} />
                  <Route path="patient/create" element={<UserCreate />} />
                  <Route
                    path="patient/profile/:username"
                    element={<UserRecord />}
                  />
                  <Route
                    path="patient/edit/:username"
                    element={<UserRecordEdit />}
                  />
                  <Route
                    path="patient/changePassword"
                    element={<ChangePassword />}
                  />
                  <Route path="patient/scan" element={<UserScan />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="archive" element={<Archive />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="admin/create" element={<AdminCreate />} />
                  <Route
                    path="admin/edit/:username"
                    element={<AdminRecordEdit />}
                  />
                  <Route
                    path="admin/profile/:username"
                    element={<AdminRecord />}
                  />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={[USER_TYPE.USER]} />}>
                <Route path="/patient" element={<USER_Layout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="request" element={<UserRequest />} />
                  <Route
                    path="request/create"
                    element={<UserRequestCreate />}
                  />
                  <Route
                    path="request/details/:reqID"
                    element={<UserRequestDetails />}
                  />
                  <Route path="transaction" element={<UserTransaction />} />
                  <Route
                    path="transaction/details/:transID"
                    element={<UserTransactionDetails />}
                  />
                  <Route path="profile/:username" element={<UUserRecord />} />
                  <Route path="edit/:username" element={<UUserRecordEdit />} />
                  <Route path="changePassword" element={<ChangePassword />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
