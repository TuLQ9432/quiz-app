import { useState, useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Container,
  Grid,
  Alert,
  TextField,
  MenuItem,
  Button,
  Snackbar,
} from "@mui/material";
import { NewUserInput } from "../../../../models/user";
import { ApiError } from "../../../../models/error";
import userApi from "../../../../services/user";
import WaitingDialog from "../../../../components/WaitingDialog";

const roles = ["admin", "user"];

export default function NewUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingError, setIsSubmittingError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NewUserInput>({
    mode: "onTouched",
  });

  const handleBack = useCallback(() => {
    navigate("/admin/users");
  }, [navigate]);

  const handleSave = useCallback<SubmitHandler<NewUserInput>>(
    (data) => {
      setIsSubmittingError(false);
      setIsSubmitting(true);
      userApi
        .create(data)
        .then(handleBack)
        .catch((error: ApiError) => {
          const errorResponse = error.response;
          setIsSubmittingError(true);
          if (errorResponse) setErrorMessage(errorResponse.data.message);
          else setErrorMessage("Unknown error occured.");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [handleBack]
  );

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        flex={1}
        component="form"
        onSubmit={handleSubmit(handleSave)}
      >
        <Container maxWidth="sm" sx={{ flex: 1 }}>
          <Stack justifyContent="center" alignItems="stretch" height="100%">
            <Stack direction="column" spacing={1} my={3}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    type="text"
                    error={!!errors.username}
                    helperText={errors.username ? "Required" : " "}
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email ? "Required" : " "}
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password ? "Required" : " "}
                    {...field}
                  />
                )}
              />
              <TextField
                fullWidth
                select
                label="Role"
                defaultValue={roles[1]}
                {...register("role")}
              >
                {roles.map((option) => (
                  <MenuItem key={"option-" + option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
        </Container>
        <Container maxWidth={false} sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} textAlign={{ xs: "center", sm: "left" }}>
              <Button type="button" variant="contained" onClick={handleBack}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} textAlign="center">
              <Button type="submit" variant="contained" disabled={!isValid}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Stack>
      <Snackbar
        open={isSubmittingError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert icon={false} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <WaitingDialog isWaiting={isSubmitting} text="Saving user..." />
    </>
  );
}
