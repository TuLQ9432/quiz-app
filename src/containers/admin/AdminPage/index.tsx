import { useCallback } from "react";
import { Routes, Route, Navigate, NavLink as BaseNavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import styled from "@emotion/styled";
import { Stack, Grid, Button } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { authActions } from "../../../store/auth/slice";
import QuestionTab from "../question/QuestionTab";
import UserTab from "../user/UserTab";

const NavLink = styled(BaseNavLink)`
  display: block;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  color: white;
  text-decoration: none;
  font-weight: 500;
  outline: none;

  &:hover,
  &:focus {
    background: #004799;
  }

  &.active {
    background: linear-gradient(#ffb649, white);
    color: black;
  }
`;

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const handleLogout = useCallback(() => {
    if (typeof refreshToken === "undefined") return;
    dispatch(authActions.logout({ refreshToken: refreshToken }));
  }, [refreshToken, dispatch]);

  return (
    <ConfirmProvider>
      <Stack height="100vh">
        <Grid
          container
          direction="row"
          alignItems="flex-end"
          component="header"
          width="100%"
          bgcolor="#0055B8"
        >
          <Grid
            item
            xs={12}
            sm={8}
            order={{ xs: 2, sm: 1 }}
            container
            direction="row"
            component="nav"
          >
            <NavLink to="questions">Manage questions</NavLink>
            <NavLink to="users">Manage users</NavLink>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            order={{ xs: 1, sm: 2 }}
            px={3}
            py={2}
            textAlign="right"
          >
            <Button variant="contained" onClick={handleLogout}>
              Log out
            </Button>
          </Grid>
        </Grid>
        <Routes>
          <Route index element={<Navigate to="questions" />} />
          <Route path="questions/*" element={<QuestionTab />} />
          <Route path="users/*" element={<UserTab />} />
        </Routes>
      </Stack>
    </ConfirmProvider>
  );
}
