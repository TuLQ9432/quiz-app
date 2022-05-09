import { useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link as RouterLink, Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { AuthRegisterInput } from "../../../models/auth";
import { AuthStatuses, authActions } from "../../../store/auth/slice";

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<AuthRegisterInput>();
  const { authStatus, user, showError, errorMessage } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const handleRegister = useCallback<SubmitHandler<AuthRegisterInput>>(
    (data) => {
      dispatch(authActions.register(data));
    },
    [dispatch]
  );

  const handleNavigate = useCallback(() => {
    dispatch(authActions.authReset());
  }, [dispatch]);

  if (authStatus === AuthStatuses.LOGGED_IN && user) {
    switch (user.role) {
      case "user":
        return <Navigate to="/user" />;
      case "admin":
        return <Navigate to="/admin" />;
    }
  }

  return (
    <Box my={8}>
      <Container maxWidth="sm">
        <Paper square elevation={8}>
          <Box py={4} px={3} maxWidth={400} mx="auto">
            <Typography
              component="h1"
              variant="h4"
              fontWeight={700}
              textAlign="center"
              mb={3}
            >
              Register
            </Typography>
            <Grid
              container
              spacing={3}
              component="form"
              onSubmit={handleSubmit(handleRegister)}
            >
              <Grid item xs={12}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Username"
                      variant="outlined"
                      type="text"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      type="email"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      type="password"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Button type="submit" variant="contained">
                  Sign up
                </Button>
              </Grid>
            </Grid>
            <Box
              component="p"
              width="1"
              mx={0}
              mt={3}
              mb={0}
              textAlign="center"
            >
              <Link component={RouterLink} to="/login" onClick={handleNavigate}>
                Already have an account?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={showError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={false} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "white", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authStatus === AuthStatuses.LOGGING_IN}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
