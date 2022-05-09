import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Box,
} from "@mui/material";
import LoadingContent from "../../../components/LoadingContent";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { authActions, AuthStatuses } from "../../../store/auth/slice";

export default function AuthGuard() {
  const { authStatus, user, accessToken, refreshToken } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const location = useLocation();

  if (
    authStatus === AuthStatuses.LOGGED_IN ||
    authStatus === AuthStatuses.LOGGING_OUT
  ) {
    if (typeof user === "undefined")
      return (
        <Box height="100vh">
          <LoadingContent text="Getting data of logged-in user..." />
        </Box>
      );

    if (
      location.pathname.substring(0, 6) === "/admin" &&
      user.role === "user"
    ) {
      return <Navigate to="/user" />;
    } else if (
      location.pathname.substring(0, 5) === "/user" &&
      user.role === "admin"
    ) {
      return <Navigate to="/admin" />;
    }

    return (
      <>
        <Outlet />
        <Dialog open={authStatus === AuthStatuses.LOGGING_OUT}>
          <DialogContent sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ mb: 1 }} />
            <DialogContentText>Logging out...</DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Access token has very short lifespan (few minutes)
  if (typeof accessToken === "undefined" || typeof refreshToken === "undefined")
    return <Navigate to="/" />;

  dispatch(authActions.refreshLogin());
  return <></>;
}
