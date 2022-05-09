import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";

import { Routes, Route, Navigate } from "react-router-dom";

import AuthGuard from "./containers/auth/AuthGuard";
import LoginPage from "./containers/auth/LoginPage";
import RegisterPage from "./containers/auth/RegisterPage";
import ErrorNotFoundPage from "./components/ErrorNotFoundPage";

import UserPage from "./containers/user/UserPage";
import AdminPage from "./containers/admin/AdminPage";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route element={<AuthGuard />}>
            <Route path="user" element={<UserPage />} />
            <Route path="admin/*" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<ErrorNotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
